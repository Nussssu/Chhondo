<?php

namespace App\Http\Controllers\Admin\Blog;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Blog\BlogRequest;
use App\Http\Requests\Admin\Product\ProductRequest;
use App\Models\Blog;
use App\Models\BlogCategory;
use App\Traits\FileUploadTrait;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    use FileUploadTrait;

    public function index()
    {
        $blogs = Blog::latest()->with('blog_category')->get();

        return Inertia::render('Admin/Blogs/Index', [
            'blogs' => $blogs,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $blog_category = BlogCategory::orderBy('name', 'asc')->get();
        return Inertia::render('Admin/Blogs/Create', [
            'blog_category' => $blog_category,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BlogRequest $request)
    {

        // Validate the request data
        $validatedData = $request->validated();

        // dd($validatedData);

        // Handle featured image upload
        if ($request->hasFile('image')) {
            $validatedData['image'] = $this->uploadFile($request, 'image');
        } elseif ($request->filled('image_library_path')) {
            $validatedData['image'] = $request->input('image_library_path');
        }
        unset($validatedData['image_library_path']);

        // Convert tags array to a comma-separated string
        if ($request->has('tags') && is_array($request->tags)) {
            $validatedData['tags'] = implode(',', $request->tags); // Convert array to string
        }

        // Public URL key + publish state. A new post does not ask for the slug,
        // so it is derived here rather than leaving the post unreachable.
        $validatedData['slug']         = Blog::uniqueSlug($validatedData['title']);
        $validatedData['status']       = $request->input('status', 'Published');
        $validatedData['published_at'] = now();

        Blog::create($validatedData);

        return redirect()->back()->with('success', 'New blog has created');
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $blogs = Blog::findOrFail($id);

        // The form edits tags as a plain list of strings, whatever shape the
        // stored value happens to be (Tagify JSON on older rows, CSV on new).
        $blogs->tags = $blogs->tagList();

        $blog_category = BlogCategory::orderBy('name', 'asc')->get();

        return Inertia::render('Admin/Blogs/Edit', [
            'blogs'         => $blogs,
            'blog_category' => $blog_category,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BlogRequest $request, string $id)

    {
        $blog = Blog::findOrFail($id);



        // Use the validated data from the BlogRequest
        $validatedData = $request->validated();

    

        if ($request->hasFile('image')) {
            // The old image is left on disk: images now come from the shared
            // Media Library, so deleting the file here would remove it from the
            // library and from every other place using it.
            $imagePath = $this->uploadFile($request, 'image', $blog->image);
            $validatedData['image'] = $imagePath;
        } elseif ($request->filled('image_library_path')) {
            $validatedData['image'] = $request->input('image_library_path');
        }
        unset($validatedData['image_library_path']);

        // Convert tags array to a comma-separated string
        if ($request->has('tags') && is_array($request->tags)) {
            $validatedData['tags'] = implode(',', $request->tags); // Convert array to string
        }

        // The slug changes only when the operator edits it: following the title
        // would silently move the URL of a post people have already shared. A
        // typed value is normalised, and a post without one still gets one.
        $typedSlug = trim((string) ($validatedData['slug'] ?? ''));

        if ($typedSlug !== '' && $typedSlug !== $blog->slug) {
            $validatedData['slug'] = Blog::uniqueSlug($typedSlug, $blog->id);
        } elseif (empty($blog->slug)) {
            $validatedData['slug'] = Blog::uniqueSlug($validatedData['title'], $blog->id);
        } else {
            unset($validatedData['slug']);
        }

        if ($request->filled('status')) {
            $validatedData['status'] = $request->input('status');
        }

        $blog->update($validatedData);

        // Redirect with success message
        return redirect()->route('blogs.index')->with('success', 'Blog updated successfully.');
    }


    /**
     * Copy a post into a new draft.
     *
     * The body, image, tags, category and SEO carry over; the title is marked
     * as a copy, the slug is regenerated because it is a unique key, and the
     * copy starts as a Draft so it cannot appear on the blog half-written.
     */
    public function duplicate(Blog $blog)
    {
        $copy = $blog->replicate(['created_at', 'updated_at']);

        $copy->title        = $blog->title . ' (copy)';
        $copy->slug         = Blog::uniqueSlug($copy->title);
        $copy->status       = 'Draft';
        $copy->published_at = null;
        $copy->save();

        return redirect()
            ->route('blogs.edit', $copy->id)
            ->with('success', 'Post duplicated — it is saved as a draft.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {

        // The image is deliberately not unlinked — it belongs to the shared
        // Media Library and may be used by other posts or products.
        Blog::findOrFail($id)->delete();

        return redirect()->back()->with('success', 'Blog item deleted');
    }



}
