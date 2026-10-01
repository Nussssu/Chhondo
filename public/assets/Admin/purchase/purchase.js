$(document).ready(function () {

    // Function to calculate totals
    function calculateTotals() {
        let totalPurchasingPrice = 0;

        $("#variantTableBody tr").each(function () {
            const quantity =
                parseFloat($(this).find('input[name="quantity[]"]').val()) || 0;
            const purchasingPrice =
                parseFloat(
                    $(this).find('input[name="purchasing_price[]"]').val()
                ) || 0;
            const rowTotal = quantity * purchasingPrice;
            totalPurchasingPrice += rowTotal;

            console.log(
                `Row: Qty=${quantity}, Price=${purchasingPrice}, Total=${rowTotal}`
            );
        });

        console.log(`Grand Total: ${totalPurchasingPrice}`);
        $("#purchasing_price").val(totalPurchasingPrice.toFixed(2));
        calculateDue();

        return totalPurchasingPrice;
    }

    // Function to calculate due amount
    function calculateDue() {
        const totalPrice = parseFloat($("#purchasing_price").val()) || 0;
        const paidAmount = parseFloat($("#purchasing_paid").val()) || 0;
        const dueAmount = totalPrice - paidAmount;

        $("#purchasing_due").val(dueAmount.toFixed(2));
    }

    // Event listeners for automatic calculations
    $(document).on(
        "input change",
        'input[name="quantity[]"], input[name="purchasing_price[]"]',
        function () {
            console.log("Input changed, recalculating...");
            calculateTotals();
        }
    );

    $(document).on("input change", "#purchasing_paid", function () {
        calculateDue();
    });

    // Function to combine attributes into variants
    function combineAttributes(attributes) {
        const grouped = attributes.reduce((acc, attr) => {
            acc[attr.name] = acc[attr.name] || [];
            acc[attr.name].push(attr.value);
            return acc;
        }, {});

        const keys = Object.keys(grouped);
        if (keys.length === 0) return [{}];

        return keys.reduce(
            (acc, key) => {
                return acc.flatMap((obj) =>
                    grouped[key].map((value) => ({
                        ...obj,
                        [key]: value,
                    }))
                );
            },
            [{}]
        );
    }

    // Add item button. A purchase records what was bought from a supplier, so
    // the item is typed by hand and need not exist in the storefront catalogue.
    $("#addProductButton").on("click", function () {
        const nameField = $("#itemName");
        const codeField = $("#itemCode");
        const itemName = (nameField.val() || "").trim();
        const itemCode = (codeField.val() || "").trim();

        if (itemName === "") {
            $("#productSelectError").text("Enter the item name");
            nameField.trigger("focus");
            return;
        }

        $("#productSelectError").text("");

        const tbody = $("#variantTableBody");

        // Same item twice is almost always a slip; adjust the quantity instead.
        const isDuplicate =
            tbody.find('input[name="product_name[]"]').filter(function () {
                return (this.value || "").toLowerCase() === itemName.toLowerCase();
            }).length > 0;

        if (isDuplicate) {
            $("#productSelectError").text("That item is already on this purchase");
            return;
        }

        const rowNumber = tbody.children().length + 1;
        const escape = (value) =>
            String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;")
                .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

        tbody.append(`
                        <tr>
                            <td><input type="checkbox" class="select-row" checked></td>
                            <td>${rowNumber}</td>
                            <td>${escape(itemCode) || '<span class="text-muted">—</span>'}
                                <input type="hidden" name="product_code[]" value="${escape(itemCode)}">
                            </td>
                            <td>${escape(itemName)}
                                <input type="hidden" name="product_name[]" value="${escape(itemName)}">
                            </td>
                            <td>
                                <input type="number" class="form-control quantity-input" name="quantity[]" min="1" step="1" value="1">
                                <span class="text-danger quantity-error"></span>
                            </td>
                            <td>
                                <input type="number" class="form-control purchasing-price-input" name="purchasing_price[]" min="0" step="0.01" value="0.00">
                                <span class="text-danger purchasing-price-error"></span>
                            </td>
                            <td>
                                <input type="number" class="form-control selling-price-input" name="price[]" min="0" step="0.01" value="0.00">
                                <span class="text-danger price-error"></span>
                            </td>
                            <td>
                                <button type="button" class="btn btn-sm btn-danger remove-row">Remove</button>
                            </td>
                        </tr>
                    `);

        setTimeout(() => {
            calculateTotals();
        }, 100);

        // Clear the fields so the next item can be typed straight away.
        nameField.val("").trigger("focus");
        codeField.val("");
    });

    // Remove row functionality
    $(document).on("click", ".remove-row", function () {
        const row = $(this).closest("tr");
        row.remove();
        calculateTotals();
        updateRowNumbers();
    });

    // Update row numbers
    function updateRowNumbers() {
        $("#variantTableBody tr").each(function (index) {
            $(this)
                .find("td:eq(1)")
                .text(index + 1);
        });
    }

    // Select all checkbox
    $("#selectAll").on("change", function () {
        const isChecked = $(this).is(":checked");
        $(".select-row").prop("checked", isChecked);
    });

    // Submit selected button
    $("#submitSelectedButton").on("click", async function () {
        try {
            clearErrorMessages();
            const selectedRows = $(".select-row:checked");
            if (selectedRows.length === 0) {
                alert("Please select at least one product to submit.");
                return;
            }

            if (!validateRequiredFields()) {
                return;
            }

            const selectedProducts = getSelectedProducts();
            const formData = prepareFormData(selectedProducts);

            $(this).prop("disabled", true).text("Submitting...");

            await submitFormData(formData);

            selectedRows.closest("tr").remove();
            updateRowNumbers();
            calculateTotals();
            resetForm();

            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Purchase submitted successfully",
                confirmButtonText: "OK",
            }).then(() => {
                window.location.href = "/admin/purchase";
            });
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 422) {
                const validationErrors = error.response.data.errors;
                Object.keys(validationErrors).forEach((fieldName) => {
                    showError(fieldName, validationErrors[fieldName][0]);
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops!",
                    text: "Failed to submit the purchase. Please try again.",
                    confirmButtonText: "OK",
                });
            }
        } finally {
            $(this).prop("disabled", false).html(`
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-save" viewBox="0 0 16 16">
            <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1z"/>
        </svg> Save
    `);
        }
    });

    // Validate required fields
    function validateRequiredFields() {
        let isValid = true;
        const requiredFields = [
            { id: "product", name: "purchase_name" },
            { id: "purchase_date", name: "purchase_date" },
            { id: "invoice_number", name: "invoice_number" },
            { id: "supplier_id", name: "supplier_id" },
        ];

        requiredFields.forEach((field) => {
            const element = $(`#${field.id}`);
            if (!element.val() || element.val().trim() === "") {
                showError(
                    field.name,
                    `${field.name.replace("_", " ")} is required`
                );
                isValid = false;
            }
        });

        return isValid;
    }

    // Reset form
    function resetForm() {
        $("#purchaseForm")[0].reset();
        $("#purchasing_price").val("0.00");
        $("#purchasing_paid").val("0.00");
        $("#purchasing_due").val("0.00");
        clearErrorMessages();
        toggleAttributeSection();
    }

    // Collect selected product data
    function getSelectedProducts() {
        return $(".select-row:checked")
            .map((_, el) => {
                const row = $(el).closest("tr");
                return {
                    productName: row.find('input[name="product_name[]"]').val(),
                    productCode: row.find('input[name="product_code[]"]').val(),
                    quantity: row.find('input[name="quantity[]"]').val(),
                    purchasing_price: row
                        .find('input[name="purchasing_price[]"]')
                        .val(),
                    price: row.find('input[name="price[]"]').val(),
                };
            })
            .get();
    }

    // Prepare form data
    function prepareFormData(selectedProducts) {
        const formData = new FormData();
        formData.append("purchase_name", $("#product").val());
        formData.append("purchase_date", $("#purchase_date").val());
        formData.append("invoice_number", $("#invoice_number").val());
        formData.append("document", $("#document")[0]?.files[0] || "");
        formData.append("comment", $("#comment").val());
        formData.append("supplier_id", $("#supplier_id").val());
        formData.append("total_purchasing_price", $("#purchasing_price").val());
        formData.append("total_purchasing_paid", $("#purchasing_paid").val());
        formData.append("total_purchasing_due", $("#purchasing_due").val());
        formData.append("products", JSON.stringify(selectedProducts));

        return formData;
    }

    // Submit form data
    async function submitFormData(formData) {
        const response = await axios.post("/admin/purchase", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
        });

        if (response.status !== 200 && response.status !== 201) {
            throw new Error("Failed to submit the purchase");
        }

        return response.data;
    }

    // Show error messages
    function showError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}_error`);
        if (errorElement) {
            errorElement.innerText = message;
        } else {
            console.error(`Error for ${fieldName}: ${message}`);
        }
    }

    // Clear error messages
    function clearErrorMessages() {
        const errorElements = document.querySelectorAll(".text-danger");
        errorElements.forEach((element) => {
            element.innerText = "";
        });
    }

    // Initialize calculations and attribute section on page load
    calculateTotals();
    toggleAttributeSection();
});
