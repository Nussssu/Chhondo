<?php

namespace App\Services\Admin\MediaLibrary;

use App\Models\MediaLibraryItem;
use App\Repositories\Admin\MediaLibrary\MediaLibraryRepository;
use App\Services\FileUploadService;
use App\Services\ImageUploadService;
use App\Services\MediaLibraryRegistrar;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;

class MediaLibraryService
{
    public function __construct(
        protected MediaLibraryRepository $repository,
        protected ImageUploadService $imageUploadService,
        protected FileUploadService $fileUploadService,
        protected MediaLibraryRegistrar $registrar,
    ) {
    }

    public function paginate(?string $search, int $perPage = 24, ?array $kinds = null, ?string $period = null)
    {
        return $this->repository->paginate($search, $perPage, $kinds, $period);
    }

    public function stats(): array
    {
        return $this->repository->stats();
    }

    public function find(int $id): MediaLibraryItem
    {
        return $this->repository->findOrFail($id);
    }

    public function uploadMany(array $files): array
    {
        $items = [];

        foreach ($files as $file) {
            $item = $this->uploadOne($file);
            if ($item) {
                $items[] = $item;
            }
        }

        return $items;
    }

    public function uploadOne(UploadedFile $file): ?MediaLibraryItem
    {
        // Images are re-encoded to WebP; video and documents are stored as-is.
        $kind = $this->registrar->kindFor($file->getClientOriginalName());

        $url = $kind === 'image'
            ? $this->imageUploadService->uploadImage($file, 'uploads')
            : $this->fileUploadService->upload($file, $this->folderFor($kind));

        if (! $url) {
            return null;
        }

        // Both upload services register the file already — pick the row back up
        // and stamp it with the uploader.
        $item = $this->registrar->register($url, pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));

        if ($item && ! $item->uploaded_by) {
            $item->update(['uploaded_by' => Auth::id()]);
        }

        return $item;
    }

    private function folderFor(string $kind): string
    {
        return match ($kind) {
            'video' => 'uploads/videos',
            'document' => 'uploads/documents',
            default => 'uploads',
        };
    }

    public function update(int $id, array $data): MediaLibraryItem
    {
        $item = $this->repository->findOrFail($id);

        return $this->repository->update($item, $data);
    }

    public function delete(int $id): void
    {
        $item = $this->repository->findOrFail($id);
        $this->imageUploadService->deleteFile($item->path);
        $this->repository->delete($item);
    }

    /**
     * @param array<int, int> $ids
     * @return int how many were actually removed
     */
    public function deleteMany(array $ids): int
    {
        $deleted = 0;

        foreach ($ids as $id) {
            try {
                $this->delete((int) $id);
                $deleted++;
            } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
                // Already gone — another tab or a prune got there first.
            }
        }

        return $deleted;
    }
}
