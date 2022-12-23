"use strict";

// lambda関数のエンドポイント
const baseUrl = "";

function onUpload() {
  console.log("onclick");
  const inputElement = document.getElementById("image");
  const keyElement = document.getElementById("key");
  const file = inputElement.files[0];

  const reader = new FileReader();
  reader.onload = (event) => {
    const base64 = event.currentTarget.result;
    const body = {
      base64_image: base64,
      key: keyElement.value,
    };
    fetch(baseUrl + "/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((err) => {
        console.error(err);
      });
  };
  reader.readAsDataURL(file);
}

function onGet() {
  const keyElement = document.getElementById("show-key");
  const ImageElement = document.getElementById("show-image");
  fetch(baseUrl + "/get?key=" + keyElement.value)
    .then((res) => res.json())
    .then((json) => {
      const { base64Data, contentType } = json;
      const dataUrl = `data:${contentType};base64,${base64Data}`;
      ImageElement.src = dataUrl;
    })
    .catch((err) => console.error(err));
}
