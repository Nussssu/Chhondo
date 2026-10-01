$(function () {
    localStorage.removeItem("cartProducts");

    $.post(
        carPushRoute,
        {
            _token: csrfToken,
            cart: [],
        },
        function (res) {
            setCart(res.cart);
            renderCart(res.cart);
        }
    );
});

function renderCart(cart) {
    $.ajax({
        url: carPushRoute,
        type: "POST",
        data: {
            cart: cart,
            _token: csrfToken,
        },
        success: function (res) {
            orderItemsWrapper.innerHTML = res.view;
            setCart(res.cart); // sync back
        },
    });
}

$(document).on(
    "click",
    "#orderItemsWrapper .remove-btn, #orderItemsWrapper .increase-btn, #orderItemsWrapper .decrease-btn",
    function () {
        const $btn = $(this);
        const $tr = $btn.closest("tr");
        const productId = String($tr.data("id") ?? "");
        const combo = String($tr.data("combo") ?? "");
        const cart = getCart();

        // robust index lookup (string compare to avoid type issues)
        const idx = cart.findIndex(
            (p) =>
                String(p.productId) === productId &&
                String(p.combinationId ?? "") === combo
        );
        const item = cart[idx];

        // REMOVE
        if ($btn.is(".remove-btn")) {
            if (idx > -1) {
                cart.splice(idx, 1);
                setCart(cart);
            }
            $tr.remove();
            reCalTotals();
            return;
        }

        // If we get here but item not found, warn and exit
        if (idx === -1) {
            console.warn("Cart item not found for", productId, combo);
            return;
        }

        // INCREASE
        if ($btn.is(".increase-btn")) {
            const max = Number(item.availableQty || Infinity);
            if (item.quantity < max) {
                item.quantity++;
                item.totalPrice = Number(item.quantity) * Number(item.price);
                // update UI cells
                $tr.find(".quantity-display").text(item.quantity);
                $tr.find(".item-total").text(
                    Number(item.totalPrice).toFixed(2)
                );
                setCart(cart);
                reCalTotals();
            } else {
                alert("Not enough stock");
            }
            return;
        }

        // DECREASE
        if ($btn.is(".decrease-btn")) {
            if (item.quantity > 1) {
                item.quantity--;
                item.totalPrice = Number(item.quantity) * Number(item.price);
                $tr.find(".quantity-display").text(item.quantity);
                $tr.find(".item-total").text(
                    Number(item.totalPrice).toFixed(2)
                );
                setCart(cart);
                reCalTotals();
            }
            return;
        }
    }
);

$(document).on("change", '[name="delivery_charge_area"]', function () {
    const rate = parseFloat($(this).find("option:selected").data("rate") || 0);
    $('[name="delivery_charge"]').val(rate);
    reCalTotals();
});

$(document).on(
    "input",
    '[name="discount"], [name="delivery_charge"]',
    reCalTotals
);

function reCalTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((s, i) => s + Number(i.totalPrice || 0), 0);
    const discount = parseFloat($('[name="discount"]').val() || 0) || 0;
    const delivery = parseFloat($('[name="delivery_charge"]').val() || 0) || 0;
    const total = subtotal - discount + delivery;

    // update DOM (make sure these IDs exist in your table)
    $("#subtotal-val").text(subtotal.toFixed(2));
    // $('#total-price').text(total.toFixed(2));
    $("#total-price-val").text(total.toFixed(2));
}

$("#orderUpdate").on("click", function (e) {
    e.preventDefault();
    const $form = $("#orderForm")[0];
    const url = $form.action;

    // collect form data properly
    let formData = Object.fromEntries(new FormData($form).entries());

    // prepare cart + totals
    const cart = getCart();
    const subtotal = cart.reduce((s, i) => s + Number(i.totalPrice || 0), 0);
    const discount = parseFloat($('[name="discount"]').val() || 0) || 0;
    const delivery = parseFloat($('[name="delivery_charge"]').val() || 0) || 0;
    const total = subtotal - discount + delivery;

    // build final payload
    const payload = {
        ...formData,
        cart,
        subtotal,
        discount,
        delivery_charge: delivery,
        total,
    };
    // console.log(payload);
    // return;
    $.ajax({
        url,
        method: "POST",
        data: payload,
        success: function (res) {
            if (res.success) {
                const previousPage = document.referrer || "/";
                window.location.href = previousPage;
            } else {
                Swal.fire(
                    "Error",
                    err?.responseJSON?.message || "Something went wrong",
                    "error"
                );
            }
        },
        error: function (err) {
            Swal.fire(
                "Error",
                err.responseJSON?.message || "Something went wrong",
                "error"
            );
        },
    });
});

$(document).on(
    "change",
    ".order-item-attributes-cell .attribute-select",
    function () {
        const $row = $(this).closest("tr");
        console.log($row);
        recalcOrderRow($row);
        updateCartFromRow($row);
        reCalTotals();
    }
);

function recalcOrderRow($row) {
    let basePrice = parseFloat($row.data("base-price")) || 0;
    const productName = $row.data("name") || "";
    let selected = [];
    let combinationMatch = null;
    let hasCombination = false;

    $row.find(".attribute-select").each(function () {
        const opt = $(this).find("option:selected");
        if (!opt.val()) return;

        selected.push({
            attrId: opt.data("attr-id"),
            optionId: opt.val(),
            name: $(this).data("attribute-name"),
            value: opt.text(),
            productAttributeId: opt.data("product-attribute-id"),
        });

        const map = opt.data("map");
        if (map && Object.keys(map).length) {
            hasCombination = true;
            if (!combinationMatch) combinationMatch = map;
            else {
                combinationMatch = Object.fromEntries(
                    Object.entries(combinationMatch).filter(([k]) => map[k])
                );
            }
        }
    });

    let price = basePrice;
    let qty = Infinity;
    let combinationId = null;

    if (hasCombination) {
        if (combinationMatch && Object.keys(combinationMatch).length) {
            const combo = Object.values(combinationMatch)[0];
            combinationId = Object.keys(combinationMatch)[0];
            price = basePrice + parseFloat(combo.price || 0);
            qty = parseInt(combo.quantity || 0);
        } else {
            Swal.fire({
                icon: "error",
                title: "Invalid combination",
                text: "This product combination does not exist.",
            });
            return;
        }
    } else {
        // non-combination product
        $row.find(".attribute-select option:selected").each(function () {
            const attrPrice = parseFloat($(this).data("price")) || 0;
            const attrQty = parseInt($(this).data("qty")) || 0;
            price += attrPrice;
            qty = Math.min(qty, attrQty);
        });
    }

    // Correctly get cart quantity from an input or element
    let cartQuantity = parseInt($row.find(".item-quantity").val()) || 1;

    // Update DOM
    $row.find(".product-price-cell").text(price.toFixed(2));
    $row.find(".item-total").text((price * cartQuantity).toFixed(2));

    // Store latest row data
    $row.data({
        selected,
        price,
        qty,
        combinationId,
        name: productName,
    });
}

function updateCartFromRow($row) {
    let cart = getCart();
    let productId = $row.data("id");
    let combo = $row.data("combinationId") || null;

    let item = cart.find(
        (p) => p.productId == productId && p.combinationId == combo
    );
    if (item) {
        let selected = $row.data("selected") || [];

        // 🔹 Normalize selected attributes for backend
        item.selected = selected.map((sel) => {
            return {
                attrId: sel.attribute_id || sel.attrId || null,
                optionId: sel.attribute_options_id || sel.optionId || null,
                product_attibute_id: sel.product_attibute_id || null,
                attribute_options_id: sel.attribute_options_id || null,
                quantity: sel.quantity || 1,
            };
        });

        item.price = parseFloat($row.data("price")) || item.price;
        item.availableQty = parseInt($row.data("qty")) || item.availableQty;
        item.combinationId = combo;
        item.name = $row.data("name") || item.name;
        item.totalPrice = item.quantity * item.price;
    }

    setCart(cart);
}
