import React from "react";
import { toast } from "react-toastify";

function SuccessPopUp({ icon, message }) {
    toast.success(message, {
        icon: icon,
        position: "bottom-right",
        autoClose: 3000,
    });
}

function ErrorPopUp({ icon, message }) {
    toast.error(message, {
        icon: icon,
        position: "bottom-right",
        autoClose: 3000,
    });
}


const PopUps = {
    SuccessPopUp,
    ErrorPopUp
};

export default PopUps;