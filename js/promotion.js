function downloadVoucher() {

    // Create a fake downloadable file
    const link = document.createElement("a");

    link.href = "media/voucher.pdf"; 
    link.download = "Gym-Promotion-Voucher.pdf";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert("Voucher downloaded successfully!");
}