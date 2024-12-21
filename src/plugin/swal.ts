
import SweetAlert from "sweetalert2";

const swalWithCustomStyles = SweetAlert.mixin({
    customClass: {
        title: "my-swal-title",
        confirmButton: "my-swal-confirm-button",
        cancelButton: "my-swal-cancel-button",
    },
    buttonsStyling: false,
});

export { swalWithCustomStyles };