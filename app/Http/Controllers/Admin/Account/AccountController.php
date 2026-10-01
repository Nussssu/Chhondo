<?php

namespace App\Http\Controllers\Admin\Account;

use App\Http\Controllers\Controller;
use App\Models\Purpose;
use App\Services\Admin\Account\AccountTypeServiceInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;


class AccountController extends Controller
{
    protected $accountTypeService;

    public function __construct(AccountTypeServiceInterface $accountTypeService)
    {
        $this->accountTypeService = $accountTypeService;
    }

    public function index()
    {
        $accountTypes = $this->accountTypeService->getAllAccountTypes();
        return Inertia::render('Admin/Account/Index', ['accountTypes' => $accountTypes]);
    }



    public function dashboard()
    {
        $accountTypes = $this->accountTypeService->getAllAccountTypes();
       $transactions = $this->accountTypeService->gettAllTransactions();
        $lastMonthTransactions = $this->accountTypeService->getTransactionsByMonth(now()->subMonth());

        $financialMetrics = $this->accountTypeService->calculateFinancialMetrics($transactions, $lastMonthTransactions);

        return Inertia::render('Admin/Account/Dashboard', array_merge(
            ['accountTypes' => $accountTypes, 'transactions' => $transactions],
            $financialMetrics
        ));
    }

    /**
     * Unified Account screen: overview cards on top, and every account sub-view
     * (transactions, fund transfers, account types, purposes) merged into a
     * single tabbed page instead of separate routes.
     */
    public function manage(Request $request)
    {
        $filters = $request->only(['startDate', 'endDate', 'account_type', 'transaction_type']);

        $accountTypes = $this->accountTypeService->getAllAccountTypes();
        $purposes     = $this->accountTypeService->getAllPurposes();

        // Overview totals from the full (unpaginated) transaction set, plus the
        // last-month deltas so the cards can show trend indicators.
        $allTransactions       = $this->accountTypeService->gettAllTransactions();
        $lastMonthTransactions = $this->accountTypeService->getTransactionsByMonth(now()->subMonth());
        $metrics               = $this->accountTypeService->calculateFinancialMetrics($allTransactions, $lastMonthTransactions);

        $income  = $allTransactions->where('transaction_type', 'credit')->sum('amount');
        $expense = $allTransactions->where('transaction_type', 'debit')->sum('amount');
        $balance = $income - $expense;

        // Paginated transactions for the Transactions tab (respects filters).
        $transactions = $this->accountTypeService->getAllTransactions($filters);

        // Fund transfers (paginated) with account names flattened for display.
        $transfer  = $this->accountTypeService->getAllTransfers($request->all());
        $transfers = $transfer->getCollection()->map(function ($item) {
            $item->from_balance = $item->fromAccount->name ?? '-';
            $item->to_balance   = $item->toAccount->name ?? '-';
            return $item;
        });
        $transfer->setCollection($transfers);

        return Inertia::render('Admin/Account/Manage', [
            'accountTypes'     => $accountTypes,
            'purposes'         => $purposes,
            'transactions'     => $transactions,
            'transfer'         => $transfer,
            'income'           => $income,
            'expense'          => $expense,
            'balance'          => $balance,
            'accountTypeCount' => $accountTypes->count(),
            'metrics'          => $metrics,
            'currentFilters'   => $filters,
        ]);
    }

    public function store(Request $request)
    {

        $data = $request->validate([
            'name' => 'required|string|unique:account_types,name|max:255',
        ]);

        $this->accountTypeService->createAccountType($data);

        return back()->with('success', 'Account type added successfully!');
    }


    public function update(Request $request, $accountType)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:account_types,name,' . $accountType . '|max:255',
        ]);

        $this->accountTypeService->updateAccountType($accountType, $data);

        return back()->with('success', 'Account type updated successfully!');
    }

    public function destroy($accountType)
    {
        $this->accountTypeService->deleteAccountType($accountType);

        return back()->with('success', 'Account type deleted successfully!');
    }

    //accountPurpose

    public function accountPurpose()
    {

       $purposes = $this->accountTypeService->getAllPurposes();
       $transactions = $this->accountTypeService->gettAllTransactions();
        $income = $transactions->where('transaction_type', 'credit')->sum('amount');
        $expense = $transactions->where('transaction_type', 'debit')->sum('amount');
       $balance = $income - $expense;
        return Inertia::render('Admin/Account/AccountPurpose', [
            'purposes' => $purposes,
            'income'   => $income,
            'expense'  => $expense,
            'balance'  => $balance,
        ]);
    }


    public function storePurpose(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:purposes,name|max:255',
        ]);



        $this->accountTypeService->createPurpose($data);

        return back()->with('success', 'Account purpose added successfully!');
    }


    public function updatePurpose(Request $request, $purpose)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:purposes,name,' . $purpose . '|max:255',
        ]);

        $this->accountTypeService->updatePurpose($purpose, $data);

        return back()->with('success', 'Account purpose updated successfully!');
    }

    public function destroyPurpose($purpose)
    {
        $this->accountTypeService->deletePurpose($purpose);

        return back()->with('success', 'Account purpose deleted successfully!');
    }

    //income
    public function income(Request $request)
    {


        $filters = $request->only(['startDate', 'endDate', 'account_type']);


        $allTransactions = $this->accountTypeService->getAllTransactions($filters);


        $credits = $this->accountTypeService->getAllCredits($filters);
        $debits = $this->accountTypeService->getAllDebits($filters);


        $accountTypes = $this->accountTypeService->getAllAccountTypes();

        // Calculate income (sum of credits), expenses (sum of debits), and balance (income - expense)
        $income = $credits->sum('amount');
        $expense = $debits->sum('amount');
        $balance = $income - $expense;


        $accountType = $accountTypes->count();
        return Inertia::render('Admin/Account/Income', [
            'credits'      => $credits,
            'debits'       => $debits,
            'accountTypes' => $accountTypes,
            'income'       => $income,
            'expense'      => $expense,
            'balance'      => $balance,
            'accountType'  => $accountType,
        ]);
    }

    // expense()

    public function expense(Request $request)
    {
        $filters = $request->only(['startDate', 'endDate', 'account_type']);

        $allTransactions = $this->accountTypeService->getAllTransactions($filters);

        $credits = $this->accountTypeService->getAllCredits($filters);
        $debits = $this->accountTypeService->getAllDebits($filters);

        $accountTypes = $this->accountTypeService->getAllAccountTypes();

        // Calculate income (sum of credits), expenses (sum of debits), and balance (income - expense)
        $income = $credits->sum('amount');
        $expense = $debits->sum('amount');
        $balance = $income - $expense;

        $accountType = $accountTypes->count();
        return Inertia::render('Admin/Account/Expense', [
            'credits'      => $credits,
            'debits'       => $debits,
            'accountTypes' => $accountTypes,
            'income'       => $income,
            'expense'      => $expense,
            'balance'      => $balance,
            'accountType'  => $accountType,
        ]);
    }

    //credit
    public function credit()
    {

        $accountTypes = $this->accountTypeService->getAllAccountTypes();
        $purposes = $this->accountTypeService->getAllPurposes();
        return Inertia::render('Admin/Account/Credit', [
            'accountTypes' => $accountTypes,
            'purposes'     => $purposes,
        ]);
    }

    //debit
    public function debit()
    {
        $accountTypes = $this->accountTypeService->getAllAccountTypes();
        $purposes = $this->accountTypeService->getAllPurposes();
        return Inertia::render('Admin/Account/Debit', [
            'accountTypes' => $accountTypes,
            'purposes'     => $purposes,
        ]);
    }

    public function storeDebit(Request $request)
    {
        // return $request->all();
        $data = $request->validate([
            '_token' => 'required|string',
            'transaction_date' => 'required|date',
            'purpose_id' => 'required|exists:purposes,id',
            'amount' => 'required|numeric|min:0',
            'comments' => 'nullable|string|max:255',
            'account_id' => 'required|exists:account_types,id',
            'transaction_type' => 'required|in:credit,debit',
            'document' => 'nullable|file|mimes:jpeg,png,pdf',
            'document_library_path' => 'nullable|string',
        ]);


        $this->accountTypeService->storeDebit($data);

        return back()->with('success', 'Debit added successfully!');
    }

    public function balanceTransfer(Request $request)
    {

        $transfer = $this->accountTypeService->getAllTransfers($request->all());

        // Flatten the data to include account names directly
        $transfers = $transfer->getCollection()->map(function ($item) {
            $item->from_balance = $item->fromAccount->name;
            $item->to_balance = $item->toAccount->name;
            return $item;
        });

        // Set the modified collection back to the paginator
        $transfer->setCollection($transfers);

        return Inertia::render('Admin/Account/BalanceTransfer', ['transfer' => $transfer]);
    }

    public function balanceTransferForm()
    {
      $account = $this->accountTypeService->getAllAccountTypes();
       $accounts= DB::table('account_types')
      ->join('transactions', 'account_types.id', '=', 'transactions.account_id')
      ->select(
          'account_types.id',
          'account_types.name',
          DB::raw('SUM(transactions.amount) as total_amount')
      )
      ->groupBy('account_types.id', 'account_types.name')
      ->get();



        return Inertia::render('Admin/Account/BalanceTransferForm', ['accounts' => $accounts]);
    }



    public function storeBalanceTransfer(Request $request)
    {
        // Log::info($request->all());
        $data = $request->validate([

            'from_balance' => 'required',
            'to_balance' => 'required',
            'amount' => 'required|numeric|min:0',
            'comments' => 'nullable|string|max:255',

            'transfer_amount' => 'nullable|string|max:255',
            'cost' => 'nullable|numeric|min:0',
        ]);
        if (!isset($data['transaction_date'])) {
            $data['transaction_date'] = Carbon::now()->toDateString();
        }





        $pp =   $this->accountTypeService->storeBalanceTransfer($data);


       return back()->with('success', 'Balance transfer added successfully!');
    }

    public function accountReport(Request $request)
    {
       // return $request->all();


       $filters = $request->only(['startDate', 'endDate', 'account_type', 'transaction_type']);


        $accountTypes = $this->accountTypeService->getAllAccountTypes();
       $transactions = $this->accountTypeService->getAllTransactions($filters);

       $totalDebit = $transactions->where('transaction_type', 'debit')->sum('amount');
       $totalCredit = $transactions->where('transaction_type', 'credit')->sum('amount');
       $netTotal = $totalCredit - $totalDebit;

       $transfer = $this->accountTypeService->getAllTransfers($request->all());

       // Flatten the data to include account names directly
       $transfers = $transfer->getCollection()->map(function ($item) {
           $item->from_balance = $item->fromAccount->name;
           $item->to_balance = $item->toAccount->name;
           return $item;
       });


        return Inertia::render('Admin/Account/AccountReport', [
            'accountTypes' => $accountTypes,
            'transactions' => $transactions,
            'netTotal'     => $netTotal,
            'totalCredit'  => $totalCredit,
            'totalDebit'   => $totalDebit,
            'transfers'    => $transfers,
        ]);
    }
}
