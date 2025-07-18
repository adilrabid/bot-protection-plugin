/**
 * Handle wpec turnstile integration.
 *
 * Runs when bpcft explicit rendering script is loaded.
 */
function bpcft_wpec_onload_cft() {
    /**
     * Only render the turnstile widget when the target form in displayed.
     * That's why using the wpec_validate_order and wpec_process_free_payment event listener form wpec core plugin.
     */

    // This widget id gets set when turnstile is rendered.
    let bpcft_wpec_free_checkout_cft_widget_id = {};

    document.addEventListener('wpec_validate_order', function (e) {
        const {ppecHandler} = e.detail;

        const button_id = ppecHandler.data?.id;

        const bpcft_div = document.querySelector('.bpcft_widget_full_discount_' + button_id);
        if (!bpcft_div) {
            return;
        }

        const wpec_free_checkout_form_div = document.getElementById('place-order-' + button_id);

        const isFreeCheckoutFormOpen = ppecHandler.isElementVisible(wpec_free_checkout_form_div);

        // Remove the turnstile widget if free checkout form is closed (not visible), but a previously rendered widget id is set.
        if (!isFreeCheckoutFormOpen && bpcft_wpec_free_checkout_cft_widget_id[button_id]) {
            turnstile.remove(bpcft_wpec_free_checkout_cft_widget_id[button_id])
            bpcft_wpec_free_checkout_cft_widget_id[button_id] = '';
            return;
        }

        // Render turnstile widget if the free checkout form gets opened, and it hasn't rendered (bpcft_wpec_free_checkout_cft_widget_id not set) yet.
        if (isFreeCheckoutFormOpen && !bpcft_wpec_free_checkout_cft_widget_id[button_id]) {
            bpcft_wpec_free_checkout_cft_widget_id[button_id] = turnstile.render(bpcft_div);
        }
    })

    /**
     * Append the cft response token to the free checkout request payload.
     */
    document.addEventListener('wpec_process_free_payment', function (e) {
        const {paymentData, data} = e.detail;

        const bpcft_cont = document.querySelector('.bpcft_widget_full_discount_' + data.id);
        if (bpcft_cont) {
            const token_input = bpcft_cont.querySelector('input[name="cf-turnstile-response"]');
            paymentData['bpcftResponse'] = token_input?.value;
        }
    })

    // This widget id gets set when turnstile is rendered.
    let bpcft_wpec_manual_checkout_cft_widget_id = {};

    document.addEventListener('wpec_toggle_manual_checkout_form', function (e){
        console.log('wpec_toggle_manual_checkout_form event ran') // TODO: Remove this
        const {wpecManualCheckout} = e.detail;

        const button_id = wpecManualCheckout.parent.data?.id;

        const bpcft_div = document.querySelector('.bpcft_widget_manual_checkout_' + button_id);
        if (!bpcft_div) {
            return;
        }

        const isManualCheckoutFormOpen = wpecManualCheckout.parent.isElementVisible(wpecManualCheckout.mcForm);

        // Remove the turnstile widget if manual checkout form is closed (not visible), but a previously rendered widget id is set.
        if (!isManualCheckoutFormOpen && bpcft_wpec_manual_checkout_cft_widget_id[button_id]) {
            turnstile.remove(bpcft_wpec_manual_checkout_cft_widget_id[button_id])
            bpcft_wpec_manual_checkout_cft_widget_id[button_id] = '';
            return;
        }

        // Render turnstile widget if the manual checkout form gets opened, and it hasn't rendered (bpcft_wpec_manual_checkout_cft_widget_id not set) yet.
        if (isManualCheckoutFormOpen && !bpcft_wpec_manual_checkout_cft_widget_id[button_id]) {
            bpcft_wpec_manual_checkout_cft_widget_id[button_id] = turnstile.render(bpcft_div);
        }

    })

    /**
     * Append the cft response token to the free checkout request payload.
     */
    document.addEventListener('wpec_process_manual_checkout', function (e) {
        const {paymentData, data} = e.detail;

        const bpcft_cont = document.querySelector('.bpcft_widget_manual_checkout_' + data.id);
        if (bpcft_cont) {
            const token_input = bpcft_cont.querySelector('input[name="cf-turnstile-response"]');
            paymentData['bpcftResponse'] = token_input?.value;
        }
    })
}

document.addEventListener('bpcftOnloadTurnstileCallback', bpcft_wpec_onload_cft)