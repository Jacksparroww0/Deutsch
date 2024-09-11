function toggleEditMode(button) {
  var card = button.parentElement;
  var content = card.querySelector(".card-content");

  if (card.classList.contains("editing")) {
    // Edit mode: Save the changes
    var textarea = card.querySelector("textarea");
    content.innerHTML = textarea.value.replace(/\n/g, "<br>");
    card.classList.remove("editing");
  } else {
    // View mode: Switch to edit mode
    var text = content.innerHTML.replace(/<br>/g, "\n");
    content.innerHTML = '<textarea class="editable">' + text + "</textarea>";
    card.classList.add("editing");

    // Set textarea height to fit the content
    var textarea = card.querySelector("textarea");
    textarea.style.height = "auto"; // Önce yükseklik sıfırlanır
    textarea.style.height = textarea.scrollHeight + "px"; // İçeriğe göre yükseklik ayarlanır
  }
}

function saveChanges(button) {
  var card = button.parentElement;
  var content = card.querySelector(".card-content");
  var textarea = card.querySelector("textarea");

  // Gereksiz boşlukları temizle ve satır sonlarını <br> ile değiştir
  var cleanedText = textarea.value
    .replace(/^\s+|\s+$/g, "") // Başındaki ve sonundaki boşlukları temizle
    .replace(/\n\s*\n/g, "\n") // Birden fazla ardışık yeni satır karakterlerini tek bir \n ile değiştir
    .replace(/\n/g, "<br>"); // Tekli yeni satır karakterlerini <br> ile değiştir

  content.innerHTML = cleanedText;
  card.classList.remove("editing");

  // Veriyi yerel depolamaya kaydet
  var cardId = card.querySelector("h2").innerText; // Her kart için benzersiz bir ID
  localStorage.setItem(cardId, cleanedText);
}

function cancelChanges(button) {
  var card = button.parentElement;
  var content = card.querySelector(".card-content");
  var textarea = card.querySelector("textarea");

  // Orijinal içeriği geri yükle
  var originalText = textarea.dataset.originalText.replace(/\n/g, "<br>"); // Satır sonlarını <br> ile değiştir

  content.innerHTML = originalText;
  card.classList.remove("editing");
}

// Veriyi yerel depolamaya kaydet
document.querySelectorAll(".edit-btn").forEach((button) => {
  button.addEventListener("click", function () {
    const card = this.closest(".card");
    card.classList.add("editing");
    const content = card.querySelector(".card-content");
    const textArea = card.querySelector("textarea");

    // Orijinal metni sakla
    textArea.dataset.originalText = content.innerHTML.replace(/<br>/g, "\n"); // <br> etiketlerini \n ile değiştir
  });
});

// Sayfa yüklendiğinde verileri yerel depolamadan al
window.onload = function () {
  document.querySelectorAll(".card").forEach(function (card) {
    var title = card.querySelector("h2").innerText;
    var savedContent = localStorage.getItem(title);

    if (savedContent) {
      card.querySelector(".card-content").innerHTML = savedContent;
    }
  });
};
