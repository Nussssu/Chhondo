<?php

namespace App\Http\Controllers\Admin\MediaLibrary;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MediaLibrary\MediaLibraryUpdateRequest;
use App\Services\Admin\MediaLibrary\MediaLibraryService;
use App\Services\MediaUsageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class MediaLibraryController extends Controller
{
    public function __construct(
        protected MediaLibraryService $mediaLibraryService,
        protected MediaUsageService $usageService,
    ) {
    }

    public function index(Request $request)
    {
        $items = $this->mediaLibraryService->paginate(
            $request->query('search'),
            (int) $request->query('per_page', 40),
            $this->kindFilter($request),
            $request->query('period'),
        );

        return Inertia::render('Admin/MediaLibrary/Index', [
            'items' => $this->withUsage($items),
            'search' => $request->query('search'),
            'kind' => $request->query('kind'),
            'stats' => $this->mediaLibraryService->stats(),
        ]);
    }

    /**
     * Feeds both the picker modal and the library grid. Usage is only computed
     * when asked for — it scans every content table, which the picker does not
     * need.
     */
    public function picker(Request $request)
    {
        $items = $this->mediaLibraryService->paginate(
            $request->query('search'),
            (int) $request->query('per_page', 40),
            $this->kindFilter($request),
            $request->query('period'),
        );

        return response()->json(
            $request->boolean('with_usage') ? $this->withUsage($items) : $items
        );
    }

    /**
     * Bulk upload. Each file is validated on its own so one rejected file in a
     * drag-and-drop batch does not throw away the rest — the response reports
     * what landed and what did not.
     */
    public function upload(Request $request)
    {
        $files = $request->file('files') ?? [];

        if (! is_array($files) || $files === []) {
            return response()->json(['message' => 'No files were received.'], 422);
        }

        $items = [];
        $errors = [];

        foreach ($files as $file) {
            $name = $file && method_exists($file, 'getClientOriginalName')
                ? $file->getClientOriginalName()
                : 'file';

            $validator = Validator::make(['file' => $file], [
                'file' => [
                    'required',
                    'file',
                    'mimes:jpeg,png,jpg,gif,svg,webp,mp4,webm,ogv,mov,m4v,pdf,doc,docx,xls,xlsx,csv',
                    'max:' . config('media_library.max_upload_kb', 51200),
                ],
            ], [], ['file' => $name]);

            if ($validator->fails()) {
                $errors[] = ['name' => $name, 'message' => $validator->errors()->first('file')];

                continue;
            }

            $item = $this->mediaLibraryService->uploadOne($file);

            if ($item) {
                $items[] = $item;
            } else {
                $errors[] = ['name' => $name, 'message' => 'Could not be stored.'];
            }
        }

        return response()->json(['items' => $items, 'errors' => $errors]);
    }

    public function update(MediaLibraryUpdateRequest $request, int $id)
    {
        $item = $this->mediaLibraryService->update($id, $request->validated());

        return response()->json(['item' => $item]);
    }

    /** Where a file is still referenced, so it is never deleted blind. */
    public function usage(int $id)
    {
        $item = $this->mediaLibraryService->find($id);

        return response()->json(['usage' => $this->usageService->usageFor($item->path)]);
    }

    public function destroy(int $id)
    {
        $this->mediaLibraryService->delete($id);

        return response()->json(['success' => true]);
    }

    public function bulkDestroy(Request $request)
    {
        $data = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|integer',
        ]);

        $deleted = $this->mediaLibraryService->deleteMany($data['ids']);

        return response()->json(['deleted' => $deleted]);
    }

    /**
     * Annotate a page of results with what references each file, so the grid
     * can flag unused items and warn before a delete breaks a page.
     */
    private function withUsage($paginator)
    {
        $map = $this->usageService->map();

        $paginator->getCollection()->transform(function ($item) use ($map) {
            $item->usage = $map[$item->path] ?? [];

            return $item;
        });

        return $paginator;
    }

    /**
     * Only accept kinds the library actually stores — anything else is ignored
     * rather than returning an empty list. Accepts a comma-separated list, so a
     * field like an accounting document can offer both PDFs and photos.
     *
     * @return array<int, string>|null null means "no filter"
     */
    private function kindFilter(Request $request): ?array
    {
        $kinds = array_values(array_intersect(
            array_filter(array_map('trim', explode(',', (string) $request->query('kind')))),
            ['image', 'video', 'document']
        ));

        return $kinds ?: null;
    }
}
