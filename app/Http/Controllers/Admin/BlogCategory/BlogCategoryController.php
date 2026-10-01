<?php

namespace App\Http\Controllers\Admin\BlogCategory;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $blog_categories = BlogCategory::withCount('blogs')->latest()->get();

        return Inertia::render('Admin/BlogCategory/Index', [
            'blog_categories' => $blog_categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */

    /**
     * Store a newly created resource in storage.
     */
    /**
     * Normalise the typed slug before it is validated.
     *
     * The field accepts anything, so uniqueness has to be checked against the
     * value that will actually be stored — otherwise "Styling Tips" and
     * "styling tips" both pass and then collide in the URL.
     */
    private function normaliseSlug(Request $request): void
    {
        $slug = trim((string) $request->input('slug'));

        $request->merge([
            'slug' => $slug === ''
                ? \App\Support\Slug::make((string) $request->input('name'), 'category')
                : \App\Support\Slug::make($slug, 'category'),
        ]);
    }

    public function store(Request $request)
    {
        $this->normaliseSlug($request);

        // Validate the input
        $request->validate([
            'name' => 'required|string|max:255|unique:blog_categories,name',
            'slug' => 'required|string|max:255|unique:blog_categories,slug',
        ]);

        // Save to database
        BlogCategory::create([
            'name'   => $request->name,
            'slug'   => $request->slug,
            'status' => $request->input('status', 'Enable'),
        ]);

        // Redirect with success message
        return redirect()->route('blog-category.index')->with('success', 'Blog category created successfully.');
    }

    /**
     * Display the specified resource.
     */

    /**
     * Show the form for editing the specified resource.
     */

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $category = BlogCategory::findOrFail($id);

        $this->normaliseSlug($request);

        // Validate the input
        $request->validate([
            'name' => 'required|string|max:255|unique:blog_categories,name,' . $id,
            'slug' => 'required|string|max:255|unique:blog_categories,slug,' . $id,
        ]);

        // Update the category
        $category->update([
            'name' => $request->name,
            'slug' => $request->slug,
        ]);

        // Redirect with success message
        return redirect()->route('blog-category.index')->with('success', 'Blog category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {

        BlogCategory::find($id)->delete();

        return redirect()->back()->with('success', 'Category item deleted');
    }


    public function toggleStatus(Request $request)
    {
        $category = BlogCategory::findOrFail($request->id);

        // Update the status
        $category->status = $request->status;
        $category->save();

        return response()->json(['success' => true, 'status' => $category->status]);
    }



}
