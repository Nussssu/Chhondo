<?php

namespace App\Http\Controllers\Admin\MarketingTool;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MarketingTool\MarketingToolStoreRequest;
use App\Models\MarketingTool;
use App\Services\Admin\MarketingTool\MarketingToolService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarketingToolController extends Controller
{

    protected $marketingToolService;

    public function __construct(MarketingToolService $marketingToolService)
    {
        $this->marketingToolService = $marketingToolService;
    }


    public function index()
    {
        $marketingTools = MarketingTool::orderBy('location')
            ->orderBy('priority')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('Admin/MarketingTool/Index', [
            'marketingTools' => $marketingTools,
            // Grouped by where they are printed, which is how the page reads.
            'groupedTools'   => $marketingTools->groupBy('location'),
            'locations'      => MarketingTool::LOCATIONS,
            'targets'        => array_keys(MarketingTool::TARGETS),
        ]);
    }


    public function store(MarketingToolStoreRequest $request)
    {
       
      try {
        $this->marketingToolService->create($request->validated());
        return redirect()->route('admin.marketing-tools.index')->with('success', 'Marketing tool created successfully');
      } catch (\Exception $e) {
        return redirect()->back()->with('error', 'Something went wrong');
      }
    }


    public function update(MarketingToolStoreRequest $request, $id)
    {
        try {
            $this->marketingToolService->Update($request->validated(), $id);
            return redirect()->route('admin.marketing-tools.index')->with('success', 'Marketing tool updated successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Something went wrong');
        }
    }

    public function destroy($id)
    {
        try {
            $this->marketingToolService->delete($id);
            return redirect()->route('admin.marketing-tools.index')->with('success', 'Marketing tool deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Something went wrong');
        }
    }
}
