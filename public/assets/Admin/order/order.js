//Bulk order script
$(document).ready(function () {
    // Select/Deselect all checkboxes
    $(document).on("change", "#tableDataContent #selectAll", function () {
        $("#tableDataContent .order-checkbox").prop("checked", this.checked);
    });
    // Bulk order processing
    $("#bulkAssign").on("change", function (e) {
        const selectedOrders = $(".order-checkbox:checked")
            .map(function () {
                return $(this).val();
            })
            .get();

        const userId = e.target.value;

        if (selectedOrders.length === 0) {
            alert("Please select at least one order.");
            return;
        }

        $.ajax({
            url: "/admin/orders/bulk-assign",
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            data: {
                orders: selectedOrders,
                user_id: userId,
            },
            success: function (response) {
                if (response.success) {
                    // Reload the page if the operation was successful
                    window.location.reload();
                } else {
                    // Show message if backend returned success: false
                    alert(response.message || "Failed to assign orders.");
                }
            },
            error: function (xhr) {
                // Handle validation errors or other errors
                if (xhr.status === 422) {
                    // Laravel validation errors
                    const errors = xhr.responseJSON.errors;
                    let errorMsg = "";
                    for (let field in errors) {
                        errorMsg += errors[field].join(", ") + "\n";
                    }
                    alert(errorMsg);
                } else {
                    alert(
                        "An unexpected error occurred while processing the orders."
                    );
                }
            },
        });
    });
    $("#bulkOrderButton").on("click", function () {
        const selectedOrders = $(".order-checkbox:checked")
            .map(function () {
                return $(this).val();
            })
            .get();

        if (selectedOrders.length === 0) {
            alert("Please select at least one order.");
            return;
        }

        $.ajax({
            url: "/admin/orders/bulk-order",
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"), // Dynamically fetch CSRF token
            },

            data: {
                orders: selectedOrders,
            },
            success: function (response) {
                //alert(response.message);

                if (response.redirect_url) {
                    window.location.href = response.redirect_url;
                }
            },
            error: function () {
                alert("An error occurred while processing the orders.");
            },
        });
    });
});
// Bulk order processing
$(document).on("click", ".bulkAssign", function (e) {
    e.preventDefault();

    const selectedOrders = $(".order-checkbox:checked")
        .map(function () {
            return $(this).val();
        })
        .get();

    const userId = $(this).data("id");

    if (selectedOrders.length === 0) {
        alert("Please select at least one order.");
        return;
    }

    $.ajax({
        url: "/admin/orders/bulk-assign",
        method: "POST",
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        data: {
            orders: selectedOrders,
            user_id: userId,
        },
        success: function (response) {
            if (response.success) {
                window.location.reload();
            } else {
                alert(response.message || "Failed to assign orders.");
            }
        },
        error: function (xhr) {
            if (xhr.status === 422) {
                const errors = xhr.responseJSON.errors;
                let errorMsg = "";
                for (let field in errors) {
                    errorMsg += errors[field].join(", ") + "\n";
                }
                alert(errorMsg);
            } else {
                alert(
                    "An unexpected error occurred while processing the orders."
                );
            }
        },
    });
});

//Bulk Invoice

$(document).ready(function () {
    // Handle "Select All" checkbox
    $("#selectAll").on("change", function () {
        $(".order-checkbox").prop("checked", this.checked);
    });

    // Handle "Download Invoice" button click
    $("#downloadInvoice").on("click", function () {
        let selectedOrders = [];
        $(".order-checkbox:checked").each(function () {
            selectedOrders.push($(this).val());
        });

        if (selectedOrders.length === 0) {
            alert("Please select at least one order.");
            return;
        }

        // Convert IDs to comma-separated string
        const queryString = selectedOrders.join(",");

        // Redirect to the GET route
        window.location.href = `/admin/orders/generate-pdf?order_ids=${queryString}`;
    });
});

//Bulk csv steadfast

$(document).ready(function () {
    // Select/Deselect all checkboxes
    $("#selectAll").on("change", function () {
        $(".order-checkbox").prop("checked", this.checked);
    });

    // Bulk order processing
    $("#bulkCSVSteadfast").on("click", function () {
        const selectedOrders = $(".order-checkbox:checked")
            .map(function () {
                return $(this).val();
            })
            .get();

        if (selectedOrders.length === 0) {
            alert("Please select at least one order.");
            return;
        }

        $.ajax({
            url: "/admin/orders/bulk-csv-steadfast",
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"), // Dynamically fetch CSRF token
            },

            data: {
                orders: selectedOrders,
            },
            success: function (response) {
                //alert(response.message);

                if (response.redirect_url) {
                    window.location.href = response.redirect_url;
                }
            },
            error: function () {
                alert("An error occurred while processing the Bulk CSV");
            },
        });
    });
});

//Bulk csv for pathao

$(document).ready(function () {
    // Select/Deselect all checkboxes
    $("#selectAll").on("change", function () {
        $(".order-checkbox").prop("checked", this.checked);
    });

    // Bulk order processing
    $("#bulkCSVPathao").on("click", function () {
        const selectedOrders = $(".order-checkbox:checked")
            .map(function () {
                return $(this).val();
            })
            .get();

        if (selectedOrders.length === 0) {
            alert("Please select at least one order.");
            return;
        }

        $.ajax({
            url: "/admin/orders/bulk-csv-pathao",
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"), // Dynamically fetch CSRF token
            },

            data: {
                orders: selectedOrders,
            },
            success: function (response) {
                //alert(response.message);

                if (response.redirect_url) {
                    window.location.href = response.redirect_url;
                }
            },
            error: function () {
                alert("An error occurred while processing the Bulk CSV");
            },
        });
    });
});

//Bulk Status

$(document).ready(function () {
    // Select All Functionality
    $("#selectAll").on("change", function () {
        $(".order-checkbox").prop("checked", $(this).prop("checked"));
    });

    // Bulk Update
    $(".bulk-update").on("click", function (e) {
        e.preventDefault();

        // Get selected order IDs
        let selectedOrders = [];
        $(".order-checkbox:checked").each(function () {
            selectedOrders.push($(this).val());
        });

        if (selectedOrders.length === 0) {
            alert("Please select at least one order.");
            return;
        }

        // Get status
        let status = $(this).data("status");

        // AJAX Request
        $.ajax({
            url: "/admin/orders/bulk-status-update",
            method: "POST",
            data: JSON.stringify({
                order_ids: selectedOrders, // ✅ send as proper JSON array
                status: status,
            }),
            contentType: "application/json", // ✅ tell jQuery not to form-encode
            dataType: "json", // ✅ expect JSON back
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {
                if (response.success) {
                    alert("Order statuses updated successfully!");
                    location.reload(); // Reload the page to reflect changes
                } else {
                    alert("An error occurred. Please try again.");
                }
            },
            error: function (xhr, status, error) {
                alert("An error occurred for status. Please try again.");
            },
        });
    });
});

//bulk delete

$(document).ready(function () {
    // Select All Functionality
    $("#selectAll").on("change", function () {
        $(".order-checkbox").prop("checked", $(this).prop("checked"));
    });

    $("#bulkDeleteButton").on("click", function () {
        // Gather selected order IDs
        let selectedOrderIds = [];

        $(".order-checkbox:checked").each(function () {
            selectedOrderIds.push($(this).val());
        });

        if (selectedOrderIds.length === 0) {
            alert("Please select at least one order.");
            return;
        }

        // Confirm deletion
        if (!confirm("Are you sure you want to delete the selected orders?")) {
            return;
        }

        // Make AJAX request
        $.ajax({
            url: "/admin/orders/bulk-delete", // Your route URL
            method: "POST",

            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"), // Dynamically fetch CSRF token
            },

            data: {
                order_ids: selectedOrderIds,
            },
            success: function (response) {
                if (response.success) {
                    alert(response.message);
                    // Optionally refresh the page or update the UI to reflect deletions
                    location.reload();
                }
            },
            error: function (xhr) {
                alert("An error occurred: " + xhr.responseText);
            },
        });
    });
});

//Bulk Steadfast

$(document).ready(function () {
    $("#bulkSteadfast").on("click", function () {
        // Get all checked checkboxes
        const selectedIds = $(".order-checkbox:checked")
            .map(function () {
                return $(this).val();
            })
            .get();

        if (selectedIds.length === 0) {
            alert("Please select at least one order.");
            return;
        }

        // Send the selected IDs via an AJAX request
        $.ajax({
            url: "/admin/orders/bulkSteadfast",
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"), // Dynamically fetch CSRF token
            },
            contentType: "application/json",
            data: JSON.stringify({ ids: selectedIds }),
            success: function (response) {
                if (response.success) {
                    alert(response.message || "Orders sent successfully!");
                    window.location.reload();
                    // Optionally refresh the table or update UI
                } else {
                    alert(response.message || "Something went wrong!");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                alert(
                    "An error occurred for steadfast couriar. Please try again."
                );
            },
        });
    });
});

//Bulk Redx

$(document).ready(function () {
    $("#bulkRedx").on("click", function () {
        // Get all checked checkboxes
        const selectedIds = $(".order-checkbox:checked")
            .map(function () {
                return $(this).val();
            })
            .get();

        if (selectedIds.length === 0) {
            alert("Please select at least one order.");
            return;
        }

        // Send the selected IDs via an AJAX request
        $.ajax({
            url: "/admin/orders/bulkredx",
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"), // Dynamically fetch CSRF token
            },
            contentType: "application/json",
            data: JSON.stringify({ ids: selectedIds }),
            success: function (response) {
                if (response.success) {
                    //swit alert
                    Swal.fire({
                        toast: true,
                        icon: "success",
                        text: "Redux Order sent successfully",
                        animation: false,
                        position: "top-right",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener(
                                "mouseenter",
                                Swal.stopTimer
                            );
                            toast.addEventListener(
                                "mouseleave",
                                Swal.resumeTimer
                            );
                        },
                    });

                    // Optionally refresh the table or update UI
                } else {
                    alert(response.message || "Something went wrong!");
                }
            },
        });
    });
});

//mamun vai code

$(document).ready(function () {
    // Delete button click handler
    $(".remove-item").on("click", function () {
        const data_item_id = $(this).data("item-id");
        const data_item_attr_option = $(this).data("item-attr-option-id");
        const quantity = $(this).data("item-quantity");
        ajexDelete(data_item_id, quantity);
    });
    ajexDelete = (data_item_id, quantity) => {
        $.ajax({
            url: "/admin/orders/delete-item",
            method: "DELETE",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            data: {
                item_id: data_item_id,
                quanity: quantity,
            },
            success: function (response) {
                if (response.success) {
                    window.location.reload();
                } else {
                    console.log(response);
                }
            },
            error: function (xhr) {
                alert("An error occurred while deleting the item.");
            },
        });
    };

    $(".decrease-btn").on("click", function () {
        const row = $(this).closest("tr");
        const quantityDisplay = row.find(".quantity-display");
        const quantityInput = row.find(".quantity-input");
        let currentQuantity = parseInt(quantityDisplay.text());

        if (currentQuantity > 1) {
            currentQuantity -= 1;
            quantityDisplay.text(currentQuantity);
            quantityInput.val(currentQuantity);
            updateTotalPrice();
        }
    });

    // Increase button click handler
    $(".increase-btn").on("click", function () {
        const row = $(this).closest("tr");
        const quantityDisplay = row.find(".quantity-display");
        const quantityInput = row.find(".quantity-input");
        let currentQuantity = parseInt(quantityDisplay.text());

        currentQuantity += 1;
        quantityDisplay.text(currentQuantity);
        quantityInput.val(currentQuantity);
        updateTotalPrice();
    });

    // Delete button click handler
    $(".remove-item").on("click", function () {
        const data_item_id = $(this).data("item-id");
        const data_item_attr_option = $(this).data("item-attr-option-id");
        const quantity = $(this).data("item-quantity");
        ajexDelete(data_item_id, quantity);
    });

    // Add discount input handler
    $("input[name='discount']").on("input", function () {
        updateTotalPrice();
    });

    // Function to update total price dynamically
    function updateTotalPrice() {
        let subtotal = 0;

        // Calculate subtotal from all items
        $("tbody tr").each(function (index) {
            const quantity = parseInt($(this).find(".quantity-input").val());
            const price = parseFloat(
                $(this).find(".product-price input[type='hidden']").val()
            );

            if (!isNaN(quantity) && !isNaN(price)) {
                subtotal += quantity * price;
            }
        });

        // Get delivery charge
        const deliveryCharge = parseFloat($("#delivery-charges").val()) || 0;

        // Get discount amount
        let discount = parseFloat($("input[name='discount']").val()) || 0;

        // Ensure the discount does not exceed the subtotal
        if (discount > subtotal) {
            discount = subtotal; // Cap the discount to the subtotal amount
            $("input[name='discount']").val(discount.toFixed(2)); // Update the input field with the adjusted discount
        }

        // Calculate final total
        const finalTotal = subtotal + deliveryCharge - discount;

        // Update total price displays
        $("#total-price").text(finalTotal.toFixed(2));
        $("#total-price-val").val(finalTotal.toFixed(2));
        $("#hiden_price").val(subtotal.toFixed(2));

        // Trigger change event for any dependent calculations
        $("#total-price-val").trigger("change");
    }

    // Optional: Add form validation before submit
    $("form").on("submit", function (e) {
        let isValid = true;
        const errors = [];

        // Check if quantities are valid
        $(".quantity-input").each(function () {
            const quantity = parseInt($(this).val());
            if (isNaN(quantity) || quantity < 1) {
                isValid = false;
                errors.push("All quantities must be at least 1");
                return false; // Break the loop
            }
        });

        // Check if attributes are selected where required
        $("select[name^='items'][name*='attributes']").each(function () {
            if ($(this).val() === "") {
                isValid = false;
                errors.push("All attributes must be selected");
                return false; // Break the loop
            }
        });

        if (!isValid) {
            e.preventDefault();
            alert("Please correct the following errors:\n" + errors.join("\n"));
        }
    });

    // Initialize total price on page load
    updateTotalPrice();

    // Optional: Add event listeners for attribute changes
    $("select[name^='items'][name*='attributes']").on("change", function () {
        // You can add custom logic here if attributes affect pricing
        updateTotalPrice();
    });
});

$(document).ready(function () {
    $("#examples").DataTable({
        pageLength: 3,
        lengthMenu: [3, 5, 10, 25, 50, 75, 100, 200, 500],
    });
});

//dynamic dropdown zone based

$(document).ready(function () {
    $("#city").on("change", function () {
        let cityId = $(this).val(); // Get selected city ID
        let zoneDropdown = $("#zone"); // Zone dropdown element

        // Clear existing options
        zoneDropdown.html('<option value="">লোড হচ্ছে...</option>');

        if (cityId) {
            $.ajax({
                url: `/admin/orders/get-zones/${cityId}`, // Laravel route
                type: "GET",

                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ), // Dynamically fetch CSRF token
                },

                dataType: "json",
                success: function (response) {
                    if (response.success) {
                        // Populate the zone dropdown with the received data
                        zoneDropdown.html(
                            "<option selected disabled>এলাকা নির্বাচন করুন</option>"
                        );
                        $.each(response.zones, function (index, zone) {
                            zoneDropdown.append(
                                `<option value="${zone.zone_id}">${zone.zone_name}</option>`
                            );
                        });
                    } else {
                        zoneDropdown.html(
                            '<option value="">কোনও এলাকা পাওয়া যায়নি</option>'
                        );
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error fetching zones:", error);
                    zoneDropdown.html('<option value="">ত্রুটি ঘটেছে</option>');
                },
            });
        } else {
            zoneDropdown.html('<option value="">এলাকা নির্বাচন করুন</option>');
        }
    });
});

//area based

$("#zone").change(function () {
    const zoneId = $(this).val();
    $("#area").html("<option>Loading...</option>"); // Show loading text

    if (zoneId) {
        $.ajax({
            url: "/admin/orders/get-areas", // Route to fetch areas
            method: "GET",

            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"), // Dynamically fetch CSRF token
            },

            data: { zone_id: zoneId },
            success: function (response) {
                let options =
                    "<option selected disabled>স্থান নির্বাচন করুন</option>";
                response.forEach((area) => {
                    options += `<option value="${area.area_id}">${area.area_name}</option>`;
                });
                $("#area").html(options); // Populate areas dropdown
            },
            error: function () {
                alert("Could not load areas. Please try again.");
                $("#area").html("<option>---</option>");
            },
        });
    }
});

//Bulk Select Pathao

$(document).ready(function () {
    // Select all orders
    $("#selectAll").on("change", function () {
        $(".order-checkbox").prop("checked", this.checked);
    });

    // Bulk send to Pathao
    $("#bulkPathao").on("click", function () {
        var selectedOrders = [];

        // Collect all selected order ids
        $(".order-checkbox:checked").each(function () {
            selectedOrders.push($(this).val());
        });

        if (selectedOrders.length > 0) {
            $.ajax({
                url: "/admin/orders/send-to-pathao", // Your route to handle the bulk action
                method: "POST",

                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ), // Dynamically fetch CSRF token
                },

                data: {
                    orders: selectedOrders,
                },

                success: function (response) {
                    Swal.fire({
                        toast: true,
                        icon: "success",
                        text: "Order has been created successfully",
                        animation: false,
                        position: "top-right",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener(
                                "mouseenter",
                                Swal.stopTimer
                            );
                            toast.addEventListener(
                                "mouseleave",
                                Swal.resumeTimer
                            );
                        },
                    });

                    // window.location.reload();
                    // Optionally reload the page or update the table
                },
                error: function (xhr) {
                    // Check if the response is in JSON format and contains a message
                    var response = xhr.responseJSON;
                    if (response && response.status === "error") {
                        //alert(response.message); // Show the validation error message

                        Swal.fire({
                            toast: true,
                            icon: "error",
                            text: `${response.message}`, // Corrected here
                            animation: false,
                            position: "top-right",
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener(
                                    "mouseenter",
                                    Swal.stopTimer
                                );
                                toast.addEventListener(
                                    "mouseleave",
                                    Swal.resumeTimer
                                );
                            },
                        });
                    } else {
                        //alert('An error occurred while sending the orders.');

                        Swal.fire({
                            toast: true,
                            icon: "error",
                            text: "An error occurred while sending the orders.",
                            animation: false,
                            position: "top-right",
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener(
                                    "mouseenter",
                                    Swal.stopTimer
                                );
                                toast.addEventListener(
                                    "mouseleave",
                                    Swal.resumeTimer
                                );
                            },
                        });
                    }
                },
            });
        } else {
            alert("Please select at least one order.");
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // ---------------------------
    // Search input
    // ---------------------------
    const orderSearch = document.getElementById("orderSearch");
    if (orderSearch) {
        orderSearch.addEventListener("keyup", function () {
            const query = this.value.toLowerCase();

            fetch("/admin/orders/?search=" + encodeURIComponent(query), {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
            })
                .then((res) => res.text())
                .then((html) => {
                    document.getElementById("tableDataContent").innerHTML =
                        html;
                })
                .catch((err) => console.error("Search error:", err));
        });
    }

    const paginationLimit = document.getElementById("paginationLimit");
    if (paginationLimit) {
        paginationLimit.addEventListener("change", function () {
            const pagination = this.value;

            // Get current URL and query params
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);

            // Set or update pagination param
            params.set("pagination", pagination);

            // Build new URL
            const newUrl = url.pathname + "?" + params.toString();

            // Fetch data
            fetch(newUrl, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
            })
                .then((res) => res.text())
                .then((html) => {
                    document.getElementById("tableDataContent").innerHTML =
                        html;

                    // Push updated query string to browser URL (without reload)
                    window.history.pushState({}, "", newUrl);
                })
                .catch((err) => console.error("Pagination error:", err));
        });
    }

    // ---------------------------
    // Event delegation for buttons
    // ---------------------------
    const ordersBody = document.getElementById("tableDataContent");
    if (!ordersBody) return;
    ordersBody.addEventListener("click", function (e) {
        const target = e.target.closest("button, a");
        if (!target) return;

        const tr = target.closest("tr");
        const orderId = tr?.dataset.orderId;

        // Edit note
        if (target.classList.contains("edit-note-btn")) {
            document.getElementById("noteOrderId").value = orderId;
            document.getElementById("noteText").value =
                tr.querySelector(".order-note").innerText;
        }

        // Courier tracking
        if (target.classList.contains("courier-tracking")) {
            const consignmentId = target.dataset.consignmentId;
            fetchConsignmentStatus(consignmentId);
        }

        // Delete
        if (target.classList.contains("delete-btn")) {
            if (!confirm("Are you sure you want to delete this order?"))
                e.preventDefault();
        }

        // Toggle products (show more/less)
        if (target.classList.contains("toggle-products")) {
            const cell = target.closest(".product-info-cell");
            const hiddenItems = cell.querySelectorAll(".extra-product");

            hiddenItems.forEach((item) => {
                if (item.classList.contains("d-none")) {
                    item.classList.remove("d-none");
                    item.style.maxHeight = "0px";
                    item.style.overflow = "hidden";
                    setTimeout(() => {
                        item.style.transition = "max-height 0.4s ease";
                        item.style.maxHeight = "500px"; // big enough
                    }, 10);
                } else {
                    item.style.maxHeight = "0px";
                    setTimeout(() => item.classList.add("d-none"), 400);
                }
            });

            // Toggle button text
            target.textContent =
                target.textContent === "Show more" ? "Show less" : "Show more";
        }
    });

    // ---------------------------
    // Submit comment form

    const modal = document.getElementById("commentModal");
    const orderIdInput = document.getElementById("commentOrderId");
    const newInput = document.getElementById("newCommentText");
    const select = document.getElementById("existingCommentSelect");

    // ---------------------------
    // Event delegation for edit-comment-btn
    // ---------------------------
    ordersBody.addEventListener("click", (e) => {
        const btn = e.target.closest(".edit-comment-btn");
        if (!btn) return;

        orderIdInput.value = btn.dataset.orderId;
        newInput.value = "";
        select.value = "";

        // reset forms
        document.getElementById("addCommentForm").reset();
        document.getElementById("associateCommentForm").reset();
    });

    // ---------------------------
    // Helpers
    // ---------------------------
    const updateRow = (id, text) => {
        document.querySelector(
            `tr[data-order-id="${id}"] .order-comment`
        ).innerText = text || "N/A";
        bootstrap.Modal.getInstance(modal).hide();
    };

    // ---------------------------
    // Add Comment
    // ---------------------------
    document
        .getElementById("addCommentForm")
        .addEventListener("submit", (e) => {
            e.preventDefault();

            fetch("/admin/orders/order/comment/add", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    order_id: orderIdInput.value,
                    name: newInput.value,
                }),
            })
                .then((r) => r.json())
                .then((d) => {
                    if (!d.success) return;
                    updateRow(orderIdInput.value, newInput.value);

                    // refresh dropdown
                    select.innerHTML =
                        "<option disabled selected>Select or change a comment</option>";
                    d.data.forEach((c) => {
                        select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
                    });
                });
        });

    // ---------------------------
    // Associate Existing
    // ---------------------------
    document
        .getElementById("associateCommentForm")
        .addEventListener("submit", (e) => {
            e.preventDefault();

            fetch("/admin/orders/comment", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    order_id: orderIdInput.value,
                    comment_id: select.value,
                }),
            })
                .then((r) => r.json())
                .then((d) => {
                    if (!d.success) return;
                    const text =
                        select.options[select.selectedIndex].textContent;
                    updateRow(orderIdInput.value, text);
                });
        });

    // ---------------------------
    // Submit note form
    // ---------------------------
    document
        .getElementById("orderNoteForm")
        .addEventListener("submit", function (e) {
            e.preventDefault();
            const orderId = document.getElementById("noteOrderId").value;
            const note = document.getElementById("noteText").value;

            fetch("/admin/orders/ordernote", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    order_id: orderId,
                    note,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        document.querySelector(
                            `tr[data-order-id="${orderId}"] .order-note`
                        ).innerText = note;
                        bootstrap.Modal.getInstance(
                            document.getElementById("orderNoteModal")
                        ).hide();
                    }
                });
        });

    // ---------------------------
    // Event delegation for order status change
    // ---------------------------
    ordersBody.addEventListener("click", function (e) {
        const option = e.target.closest(".order-status");
        if (!option) return;

        e.preventDefault();
        // console.log('hello')
        const orderId = option.dataset.orderId;
        const status = option.dataset.status;
        const btnClass = option.dataset.btnClass;
        const currentReason = option.dataset.reason;
        const tr = option.closest("tr");
        const dropdown = option.closest(".status-dropdown");
        const btn = dropdown.querySelector("button");

        // If status is cancelled, show modal
        // if (status === "cancelled") {
        //     const cancelModal = new bootstrap.Modal(
        //         document.getElementById("cancelModel")
        //     );
        //     // document.getElementById("orderId").value = orderId;
        //     cancelModal.show();

        //     const cancelForm = document.getElementById("cancelReasonForm");
        //     document.getElementById("cancelReason").value = currentReason;
        //     cancelForm.onsubmit = function (ev) {
        //         ev.preventDefault();

        //         const reason = document
        //             .getElementById("cancelReason")
        //             .value.trim();
        //         if (!reason) {
        //             alert("Please enter a reason for cancellation.");
        //             return;
        //         }

        //         fetch("/admin/orders/cancel/reason", {
        //             method: "POST",
        //             headers: {
        //                 "X-CSRF-TOKEN": document
        //                     .querySelector('meta[name="csrf-token"]')
        //                     .getAttribute("content"),
        //                 "Content-Type": "application/json",
        //             },
        //             body: JSON.stringify({
        //                 order_id: orderId,
        //                 reason: reason,
        //             }),
        //         })
        //             .then((res) => res.json())
        //             .then((data) => {
        //                 if (data.success) {
        //                     cancelModal.hide();
        //                     document.getElementById("cancelReason").value = "";

        //                     // Fetch updated table content
        //                     fetch(window.location.href, {
        //                         headers: {
        //                             "X-Requested-With": "XMLHttpRequest",
        //                         },
        //                     })
        //                         .then((res) => res.text())
        //                         .then((html) => {
        //                             document.getElementById(
        //                                 "tableDataContent"
        //                             ).innerHTML = html;
        //                         })
        //                         .catch((err) =>
        //                             console.error(
        //                                 "Error fetching table content:",
        //                                 err
        //                             )
        //                         );
        //                 } else {
        //                     alert(
        //                         "Failed to cancel order: " +
        //                             (data.message || "")
        //                     );
        //                 }
        //             })
        //             .catch((err) => {
        //                 console.error("Error cancelling order:", err);
        //                 alert("Error cancelling order");
        //             });
        //     };

        //     return; // Stop further execution
        // }

        // Normal status update for other statuses
        fetch("/admin/orders/bulk-status-update", {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                order_ids: Array.isArray(orderId) ? orderId : [orderId], // ensure it's always an array
                status: status,
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                if (data.success) {
                    // Update button label
                    btn.textContent =
                        status === "shipped"
                            ? "Partial delivery"
                            : status.charAt(0).toUpperCase() + status.slice(1);

                    // Update button style
                    btn.className = "btn btn-sm dropdown-toggle " + btnClass;
                } else {
                    alert(data.message || "Failed to update status");
                }
            })
            .catch((err) => {
                console.error("Error updating status:", err);
                alert("Error updating status");
            });
    });

    ordersBody.addEventListener("click", function (e) {
        const el = e.target.closest(".cancel-reason");
        if (!el) return;

        el.classList.toggle("expanded");
    });

    // ---------------------------
    // Consignment tracking
    // ---------------------------
    function fetchConsignmentStatus(consignmentId) {
        const loading = document.getElementById("consignmentLoading");
        const content = document.getElementById("consignmentContent");
        const error = document.getElementById("consignmentError");

        loading.style.display = "block";
        content.style.display = "none";
        error.classList.add("d-none");

        fetch(
            "/admin/orders/consignment-status?consignment_id=" + consignmentId
        )
            .then((res) => res.json())
            .then((data) => {
                loading.style.display = "none";
                if (data?.delivery_status) {
                    content.innerHTML = `<p><strong>Status:</strong> ${data.delivery_status}</p>`;
                    content.style.display = "block";
                } else {
                    throw new Error("Invalid response");
                }
            })
            .catch((err) => {
                loading.style.display = "none";
                error.textContent = err.message;
                error.classList.remove("d-none");
            });
    }
});

document.addEventListener("click", function (e) {
    if (e.target.closest(".deleteButton")) {
        e.preventDefault();

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                // Get the href from the clicked button
                const deleteUrl = e.target
                    .closest(".deleteButton")
                    .getAttribute("href");

                // Create and submit a form programmatically
                const form = document.createElement("form");
                form.method = "POST";
                form.action = deleteUrl;

                // Add CSRF token if using Laravel
                const csrfToken = document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute("content");
                if (csrfToken) {
                    const csrfInput = document.createElement("input");
                    csrfInput.type = "hidden";
                    csrfInput.name = "_token";
                    csrfInput.value = csrfToken;
                    form.appendChild(csrfInput);
                }

                // Add method spoofing for DELETE request
                const methodInput = document.createElement("input");
                methodInput.type = "hidden";
                methodInput.name = "_method";
                methodInput.value = "GET";
                form.appendChild(methodInput);

                document.body.appendChild(form);
                form.submit();
            }
        });
    }
});

$(document).ready(function () {
    $("#toggleCard").on("click", function () {
        $("#filterForm").slideToggle();
    });
});

// When a card is clicked
document.querySelectorAll(".card.status-card").forEach((card) => {
    card.addEventListener("click", function () {
        // Remove 'active' class from all cards
        document
            .querySelectorAll(".card")
            .forEach((c) => c.classList.remove("active"));

        // Add 'active' class to the clicked card
        this.classList.add("active");

        // Get the status from the card's data-status attribute
        let status = this.getAttribute("data-status");

        // Update the URL query parameter with the selected status
        updateStatusFilter(status);
    });
});

// Function to update the status filter in the URL
function updateStatusFilter(status) {
    const url = `../admin/orders?status=${status}`;
    window.location.href = url; // Redirect to the URL
}

function fetchFilteredData(status) {
    fetch(`/admin/orders/filter?status=${status}`)
        .then((response) => response.json())
        .then((data) => {
            const url = `/orders ?status=${status}`;
            window.location.href = url; // Redirect to the URL
        })
        .catch((error) =>
            console.error("Error fetching filtered data:", error)
        );
}

// Optional: Reset Active Card (if the page is directly loaded with a filter status)
document.addEventListener("DOMContentLoaded", function () {
    let urlParams = new URLSearchParams(window.location.search);
    let status = urlParams.get("status");

    if (status) {
        document.querySelectorAll(".card").forEach((card) => {
            if (card.getAttribute("data-status") === status) {
                card.classList.add("active");
            }
        });
    }
});
