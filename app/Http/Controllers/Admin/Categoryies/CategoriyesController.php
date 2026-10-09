<?php

namespace App\Http\Controllers\Admin\Categoryies;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Traits\FileUploadTrait;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriyesController extends Controller
{

    use FileUploadTrait;

    public function index()
    {
        $categories = Category::withCount('products')->orderBy('serial', 'asc')->get();

        return Inertia::render('Admin/Categories/Index', [
            // Flattened depth-first so the table can indent children under their
            // parent while staying a simple list to render and reorder.
            'categories' => $this->asTree($categories),
        ]);
    }

    /**
     * Depth-first ordering with a depth on each row.
     *
     * @param  \Illuminate\Support\Collection  $categories
     * @return array<int, array<string, mixed>>
     */
    private function asTree($categories, ?int $parentId = null, int $depth = 0): array
    {
        $out = [];

        foreach ($categories->where('parent_id', $parentId) as $category) {
            $row = $category->toArray();
            $row['depth'] = $depth;
            $out[] = $row;

            // A category orphaned by bad data would otherwise vanish from the
            // list entirely; recursion only follows real parent links.
            $out = array_merge($out, $this->asTree($categories, $category->id, $depth + 1));
        }

        return $out;
    }

    /**
     * Parents a category may be moved under: anything except itself and its own
     * descendants, which would detach that branch from the tree.
     */
    private function parentRule(?int $categoryId): array
    {
        $rule = ['nullable', 'exists:categories,id'];

        if ($categoryId) {
            $rule[] = function (string $attribute, mixed $value, \Closure $fail) use ($categoryId) {
                $category = Category::find($categoryId);

                if ($category && in_array((int) $value, $category->descendantIds(), true)) {
                    $fail('A category cannot be placed inside itself or one of its own sub-categories.');
                }
            };
        }

        return $rule;
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        return \App\Support\Slug::unique($name, 'categories', ignoreId: $ignoreId, fallback: 'category');
    }

    public function serialUpdate(Request $request)
    {
        try {
            // Validate request
            $request->validate([
                'order' => 'required|array',
                'order.*.id' => 'required|integer|exists:categories,id',
                'order.*.position' => 'required|integer'
            ]);
    
            // Loop through and update category positions
            foreach ($request->order as $order) {
                Category::where('id', $order['id'])->update(['serial' => $order['position']]);
            }
    
            return response()->json(['success' => true, 'message' => 'Category order updated successfully!']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error updating order!', 'error' => $e->getMessage()], 500);
        }
    }
    

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            // Heading and the line under it on the category page. Blank falls
            // back to the wording the storefront generates from the name.
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:500',
            // What search engines show for this category's page.
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'parent_id' => $this->parentRule(null),
            // Whether shoppers are offered this category in the archive filter.
            'show_in_filter' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'image_library_path' => 'nullable|string',
        ]);

        $data['parent_id'] = $data['parent_id'] ?? null;
        // A new category belongs in the filter unless it is said otherwise; an
        // unchecked checkbox posts nothing at all.
        $data['show_in_filter'] = $request->boolean('show_in_filter', true);
        $data['slug'] = $this->uniqueSlug($data['name']);

        if ($request->hasFile('image')) {
            $data['image'] = $this->uploadFile($request->file('image'), 'Category');
        } elseif (! empty($data['image_library_path'])) {
            $data['image'] = $data['image_library_path'];
        }
        unset($data['image_library_path']);

        Category::create($data);

        return redirect()->back()->with('success', 'New data created');
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            // The category's public address, editable so it can be corrected.
            'slug' => 'nullable|string|max:255|unique:categories,slug,' . $category->id,
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:500',
            // What search engines show for this category's page.
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'parent_id' => $this->parentRule($category->id),
            'show_in_filter' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'image_library_path' => 'nullable|string',
        ]);

        // Defaults to what the category already has, so a caller that does not
        // post the field cannot silently put a hidden category back in the filter.
        $data['show_in_filter'] = $request->boolean('show_in_filter', (bool) $category->show_in_filter);

        $data['parent_id'] = $data['parent_id'] ?? null;

        // A typed slug wins and is normalised the same way a generated one is;
        // renaming the category no longer moves its URL on its own, since that
        // would break links customers have saved.
        $typedSlug = trim((string) ($data['slug'] ?? ''));

        if ($typedSlug !== '' && $typedSlug !== $category->slug) {
            $data['slug'] = $this->uniqueSlug($typedSlug, $category->id);
        } elseif (blank($category->slug)) {
            $data['slug'] = $this->uniqueSlug($data['name'], $category->id);
        } else {
            unset($data['slug']);
        }

        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($category->image && file_exists(public_path('Category/' . basename($category->image)))) {
                unlink(public_path('Category/' . basename($category->image)));
            }

            // Upload the new image
            $data['image'] = $this->uploadFile($request->file('image'), 'Category');
        } elseif (! empty($data['image_library_path'])) {
            $data['image'] = $data['image_library_path'];
        }
        unset($data['image_library_path']);

        // Update the category
        $category->update($data);

        return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully!');
    }


    public function updateStatus(Request $request)
    {
        $category = Category::findOrFail($request->id);
        $category->status = $request->status;
        $category->save();

        return response()->json(['success' => true, 'status' => $category->status]);
    }

    /**
     * Show or hide a category in the storefront's archive filter.
     *
     * Its own page is unaffected — this only decides whether shoppers are
     * offered it as a filter option.
     */
    public function updateFilterVisibility(Request $request)
    {
        $data = $request->validate([
            'id' => 'required|integer|exists:categories,id',
            'show_in_filter' => 'required|boolean',
        ]);

        $category = Category::findOrFail($data['id']);
        $category->show_in_filter = $data['show_in_filter'];
        $category->save();

        return response()->json([
            'success' => true,
            'show_in_filter' => $category->show_in_filter,
        ]);
    }




    public function destroy($id)
    {

        $category = Category::findOrFail($id);

        // If there is an old image, delete it from the public directory
        if ($category->image && file_exists(public_path('Category/' . basename($category->image)))) {
            unlink(public_path('Category/' . basename($category->image)));
        }

        // Children move up to where their parent sat, matching WooCommerce.
        // The FK is nullOnDelete, but that would flatten them to top level and
        // lose their place in the tree.
        $category->children()->update(['parent_id' => $category->parent_id]);

        // A product filed here and elsewhere keeps its other shelves. The FK on
        // products.category_id cascades, so the primary has to be re-elected
        // *before* the category goes — otherwise removing one category would
        // delete products that still belong to another.
        Product::where('category_id', $category->id)
            ->with('categories:id')
            ->get()
            ->each(function (Product $product) use ($category) {
                $replacement = $product->categories
                    ->first(fn ($c) => (int) $c->id !== (int) $category->id);

                if ($replacement) {
                    $product->forceFill(['category_id' => $replacement->id])->save();
                }
            });

        $category->delete();

        return redirect()->back()->with('success', 'Category item deleted');
    }
}
