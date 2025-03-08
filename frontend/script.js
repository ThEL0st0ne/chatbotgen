//let backend_url = "https://chatgenbackend-production.up.railway.app";
 let backend_url = "http://127.0.0.1:8000";

function togglecard() {
  let card = document.getElementById("inputcard");
  card.style.display = card.style.display === "flex" ? "none" : "flex";
}
function closecard() {
  document.getElementById("inputcard").style.display = "none";
}

async function addBot(name, apiKey) {
  try {
    const response = await fetch(`${backend_url}/generate-html`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        filename: `${name}`,
        apiKey: `${apiKey}`,
      }),
    });
  } catch (error) {
    console.log(error);
  }
}

async function deleteFile(fileName) {
  try {
    const response = await fetch(`${backend_url}/delete-file/${fileName}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (response.ok) {
    } else {
      console.error("Error:", data.detail);
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
}

function generateSecureCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const array = new Uint8Array(6);
  window.crypto.getRandomValues(array);
  return Array.from(array, (num) => characters[num % characters.length]).join(
    ""
  );
}

function extractFileInfo(fileName) {
  // Regular expression to match: name-code.extension
  const regex = /^(.+?)-(.+?)\.[a-zA-Z0-9]+$/;
  const match = fileName.match(regex);

  if (match) {
    return {
      name: match[1], // Extracted Name
      code: match[2], // Extracted Code
    };
  } else {
    console.error("Invalid file format:", fileName);
    return null;
  }
}

window.addEventListener("load", async () => {
  try {
    const response = await fetch(`${backend_url}/get-bots-files`); // Replace with your server URL if deployed
    const data = await response.json(); // Convert response to JSON

    // Convert the stringified list into an array
    const filesArray = data.files ? data.files.split(", ") : [];

    filesArray.forEach((file) => {
      const fileInfo = extractFileInfo(file);

      let sqContainer = document.getElementById("chatBotContainer");

      const originalBot = document.getElementById("example-bot");

      const cloneBot = originalBot.cloneNode(true);

      cloneBot.setAttribute("id", "");
      cloneBot.setAttribute("data-name", ` ${fileInfo.name}`);
      cloneBot.querySelector(".chatBotName").textContent = fileInfo.name;
      cloneBot.querySelector(".chatBotCode").textContent = fileInfo.code;
      cloneBot.querySelector(".chatBotApiKey").textContent = "Api Key:" + "";

      fetch(`${backend_url}/get_chatIcon/${fileInfo.code}`)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch image");
          return response.json();
        })
        .then((data) => {
          cloneBot.querySelector("#chatIconPreviewImage").src = data.image_data;
          cloneBot.querySelector("#chatIconPreviewImage").style.display =
            "block";
          cloneBot.querySelector("#chatIconUploadText").style.display = "none";
        })
        .catch((error) => console.error("Error loading image:", error));
      fetch(`${backend_url}/get_botIcon/${fileInfo.code}`)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch image");
          return response.json();
        })
        .then((data) => {
          cloneBot.querySelector("#botIconPreviewImage").src = data.image_data;
          cloneBot.querySelector("#botIconPreviewImage").style.display =
            "block";
          cloneBot.querySelector("#botIconUploadText").style.display = "none";
        })
        .catch((error) => console.error("Error loading image:", error));

      fetch(`${backend_url}/get_bg/${fileInfo.code}`)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch image");
          return response.json();
        })
        .then((data) => {
          cloneBot.querySelector("#previewBgImage").src = data.image_data;
          cloneBot.querySelector("#previewBgImage").style.display = "block";
          cloneBot.querySelector("#bgImageUploadText").style.display = "none";
        })
        .catch((error) => console.error("Error loading image:", error));

      fetch(`${backend_url}/header_img/${fileInfo.code}`)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch image");
          return response.json();
        })
        .then((data) => {
          cloneBot.querySelector("#previewHeaderImage").src = data.data;
          cloneBot.querySelector("#previewHeaderImage").style.display = "block";
          cloneBot.querySelector("#headerImageUploadText").style.display =
            "none";
        })
        .catch((error) => console.error("Error loading image:", error));

      fetch(`${backend_url}/chatbox_text/${fileInfo.code}`)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch data");
          return response.json();
        })
        .then((data) => {
          document.getElementById("chatboxtext").value = data.data;
        })
        .catch((error) => console.error("Error loading image:", error));

      cloneBot
        .querySelector(".botLink")
        .setAttribute("href", `${backend_url}/bot/${file}`);
      cloneBot.querySelector(
        ".botLink"
      ).textContent = `${backend_url}/bot/${file}`;
      sqContainer.appendChild(cloneBot);
    });
  } catch (error) {
    console.error("Error fetching bot files:", error);
    return [];
  }
});

function addchatBot() {
  let name = document.getElementById("name-input").value;
  let apiKey = document.getElementById("api-input").value;
  let code = generateSecureCode();

  let botCode = name.toLowerCase() + "-" + code;

  addBot(botCode, apiKey);

  let sqContainer = document.getElementById("chatBotContainer");

  const originalBot = document.getElementById("example-bot");

  const cloneBot = originalBot.cloneNode(true);

  cloneBot.setAttribute("id", "");
  cloneBot.setAttribute("data-name", ` ${name}`);
  cloneBot.querySelector(".chatBotName").textContent = name;
  cloneBot.querySelector(".chatBotCode").textContent = code;
  cloneBot.querySelector(".chatBotApiKey").textContent = "Api Key:" + apiKey;
  cloneBot
    .querySelector(".botLink")
    .setAttribute("href", `${backend_url}/bot/${botCode}.html`);
  cloneBot.querySelector(
    ".botLink"
  ).textContent = `${backend_url}/bot/${botCode}.html`;
  sqContainer.appendChild(cloneBot);

  closecard();
}
function dragElement(event, elmnt) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (
    event.target.tagName.toLowerCase() === "input" ||
    event.target.tagName.toLowerCase() === "select" ||
    event.target.tagName.toLowerCase() === "button"
  ) {
    return;
  }
  event.preventDefault();
  pos3 = event.clientX;
  pos4 = event.clientY;
  document.onmouseup = closeDragElement;
  document.onmousemove = elementDrag;
  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }
  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function searchFunction() {
  const searchValue = document.getElementById("search").value.toLowerCase();
  const boxes = document.querySelectorAll(".chatBot");

  boxes.forEach((box) => {
    const name = box.getAttribute("data-name").toLowerCase();
    if (searchValue === "" || name.includes(searchValue)) {
      box.style.display = "flex";
    } else {
      box.style.display = "none";
    }
  });
}

async function deleteBot(button) {
  const bot = button.parentElement.parentElement;
  const botName = bot.querySelector(".chatBotName").textContent.toLowerCase();
  const botCode = bot.querySelector(".chatBotCode").textContent;
  await deleteFile(botName + "-" + botCode + ".html");
  bot.remove();
}

const cropModal = document.getElementById("cropModal");
const cropImage = document.getElementById("cropImage");
const cropBtn = document.getElementById("cropBtn");
const cancelBtn = document.getElementById("cancelBtn");

let cropper;

// Click to upload image
function chatIconImageInput(button) {
  const parentDiv = button.parentElement.parentElement.parentElement;
  const bot = parentDiv.parentElement.parentElement;
  let flag = false;

  const botName = bot.querySelector(".chatBotName").textContent.toLowerCase();
  const botCode = bot.querySelector(".chatBotCode").textContent;

  const chatIconImageInput = parentDiv.querySelector("#chatIconImageInput");
  const chatIconPreviewImage = parentDiv.querySelector("#chatIconPreviewImage");
  const chatIconUploadText = parentDiv.querySelector("#chatIconUploadText");

  chatIconImageInput.click();

  chatIconImageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    flag = true;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        cropImage.src = e.target.result;
        cropModal.style.display = "flex";

        // Destroy old cropper instance
        if (cropper) cropper.destroy();

        cropper = new Cropper(cropImage, {
          aspectRatio: 1,
          viewMode: 1,
        });
      };
      reader.readAsDataURL(file);
    }
  });

  // Crop and save the image
  cropBtn.addEventListener("click", () => {
    if (flag && cropper) {
      const croppedCanvas = cropper.getCroppedCanvas({
        width: 50,
        height: 50,
      });

      const imageDataUrl = croppedCanvas.toDataURL("image/png");
      const payload = {
        bot_code: botCode, // Send botCode as key
        filename: `${botName}-${botCode}-boticon.png`,
        image_data: imageDataUrl,
      };

      fetch(`${backend_url}/chatIconSave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Upload failed");
        })
        .catch((error) => console.error("Upload Error:", error));

      chatIconPreviewImage.src = imageDataUrl;
      chatIconPreviewImage.style.display = "block";
      chatIconUploadText.style.display = "none";
      cropModal.style.display = "none";
      chatIconImageInput.value = ""; // Reset file input
      flag = false;
    }
  });

  // Cancel cropping
  cancelBtn.addEventListener("click", () => {
    cropModal.style.display = "none";
    chatIconImageInput.value = ""; // Reset file input
  });

  // Close modal when clicking outside of it
  cropModal.addEventListener("click", (event) => {
    if (event.target === cropModal) {
      cropModal.style.display = "none";
    }
  });
}

function botIconImageInput(button) {
  const parentDiv = button.parentElement.parentElement.parentElement;
  const bot = parentDiv.parentElement.parentElement;
  let flag = false;

  const botName = bot.querySelector(".chatBotName").textContent.toLowerCase();
  const botCode = bot.querySelector(".chatBotCode").textContent;

  const botIconImageInput = parentDiv.querySelector("#botIconImageInput");
  const botIconPreviewImage = parentDiv.querySelector("#botIconPreviewImage");
  const botIconUploadText = parentDiv.querySelector("#botIconUploadText");

  botIconImageInput.click();

  botIconImageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    flag = true;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        cropImage.src = e.target.result;
        cropModal.style.display = "flex";

        // Destroy old cropper instance
        if (cropper) cropper.destroy();

        cropper = new Cropper(cropImage, {
          aspectRatio: 1,
          viewMode: 1,
        });
      };
      reader.readAsDataURL(file);
    }
  });

  // Crop and save the image
  cropBtn.addEventListener("click", () => {
    if (flag && cropper) {
      const croppedCanvas = cropper.getCroppedCanvas({
        width: 60,
        height: 60,
      });

      const imageDataUrl = croppedCanvas.toDataURL("image/png");
      const payload = {
        bot_code: botCode, // Send botCode as key
        filename: `${botName}-${botCode}-boticon.png`,
        image_data: imageDataUrl,
      };

      fetch(`${backend_url}/botIconSave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Upload failed");
        })
        .catch((error) => console.error("Upload Error:", error));

      botIconPreviewImage.src = imageDataUrl;
      botIconPreviewImage.style.display = "block";
      botIconUploadText.style.display = "none";
      cropModal.style.display = "none";
      botIconImageInput.value = ""; // Reset file input
      flag = false;
    }
  });

  // Cancel cropping
  cancelBtn.addEventListener("click", () => {
    cropModal.style.display = "none";
    botIconImageInput.value = ""; // Reset file input
  });

  // Close modal when clicking outside of it
  cropModal.addEventListener("click", (event) => {
    if (event.target === cropModal) {
      cropModal.style.display = "none";
    }
  });
}

function bgImageInput(button) {
  const parentDiv = button.parentElement.parentElement;
  const bot = parentDiv.parentElement.parentElement;
  let flag = false;

  const botName = bot.querySelector(".chatBotName").textContent.toLowerCase();
  const botCode = bot.querySelector(".chatBotCode").textContent;

  const bgImageFileInput = parentDiv.querySelector("#bgImageFileInput");
  const previewBgImage = parentDiv.querySelector("#previewBgImage");
  const bgImageUploadText = parentDiv.querySelector("#bgImageUploadText");

  bgImageFileInput.click();

  bgImageFileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    flag = true;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Show preview without cropping
        previewBgImage.src = e.target.result;
        previewBgImage.style.display = "block";
        bgImageUploadText.style.display = "none";

        // Save the image
        saveImage(e.target.result, botCode);
      };
      reader.readAsDataURL(file);
    }
  });
}
function saveImage(imageDataUrl, botCode) {
  const payload = {
    code: botCode,
    image: imageDataUrl,
  };

  fetch(`${backend_url}/bgSave`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Upload failed");
    })
    .catch((error) => console.error("Upload Error:", error));
}

function sendChatBoxText(button) {
  const parent = button.parentElement.parentElement;
  const code = parent.querySelector(".chatBotCode").textContent;
  const chatboxtext = parent.querySelector("#chatboxtext").value;

  fetch(`${backend_url}/chatboxtext`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: chatboxtext, code: code }),
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
}

function setChatGradient(button) {
  const parent = button.parentElement.parentElement;
  const code = parent.querySelector(".chatBotCode").textContent;
  const chatgradient = parent.querySelector("#chatgradient").value;

  fetch(`${backend_url}/chatgradient`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ gradient: chatgradient, code: code }),
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
}

function headerImageInput(button) {
  const parentDiv = button.parentElement.parentElement;
  const bot = parentDiv.parentElement.parentElement;
  let flag = false;

  const botName = bot.querySelector(".chatBotName").textContent.toLowerCase();
  const botCode = bot.querySelector(".chatBotCode").textContent;

  const headerImageFileInput = parentDiv.querySelector("#headerImageFileInput");
  const previewHeaderImage = parentDiv.querySelector("#previewHeaderImage");
  const headerImageUploadText = parentDiv.querySelector(
    "#headerImageUploadText"
  );

  headerImageFileInput.click();

  headerImageFileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    flag = true;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Show preview without cropping
        previewHeaderImage.src = e.target.result;
        previewHeaderImage.style.display = "block";
        headerImageUploadText.style.display = "none";

        // Save the image
        saveHeaderImage(e.target.result, botCode);
      };
      reader.readAsDataURL(file);
    }
  });
}
function saveHeaderImage(imageDataUrl, botCode) {
  const payload = {
    code: botCode,
    image: imageDataUrl,
  };

  fetch(`${backend_url}/headerImg`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Upload failed");
    })
    .catch((error) => console.error("Upload Error:", error));
}
