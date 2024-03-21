document
  .getElementById("createAcc")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;
    const pass = document.getElementById("password").value;
    const confirmPassword = document.getElementById("password1").value;

    if (!email || !pass || !username || !confirmPassword) {
      alert("Please fill all input fields");
      return;
    }

    if (pass !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Send a POST request to the server to register the user
    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role, email, pass }), // Send email and password to the server
      });

      if (!response.ok) {
        const errorMessage = await response.text(); // Get the error message from the server
        throw new Error(errorMessage || "Failed to register user");
      }

      // Show confirmation message to the user
      alert("User registration successful! Please login to continue.");
      const id = await response.text();
      sessionStorage.setItem("user_id", id);
      window.location.href = "./profile.html";
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Failed to register user. Please try again.");
    }
  });

async function signin() {
  //This is the function for submitting the credentials in the login page
  //
  let email = document.getElementById("email").value;
  let pass = document.getElementById("password").value;

  // If both username and password fields are empty
  // the window will alert that the user needs to fill in both fields
  if (!username || !pass) {
    alert("Please fill missing input");
    return;
  }

  // we will change the url of this once we get to deploy our API
  await fetch("http://localhost:3000/api/v1/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, pass: pass }),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == "OK") {
        window.location.href = "./home.html";
      } else {
        alert("Invalid Username or Password");
        return;
      }
    });
}

async function profile() {
  const new_id = sessionStorage.getItem("new_id");
  const name = document.getElementById("name").value;
  const picInput = document.getElementById("pic");
  const locations = document.getElementById("locations").value;

  // Read the selected image file as base64
  const file = picInput.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const imageBase64 = event.target.result;

    // Make the fetch request with the base64 image data
    uploadProfile(new_id, name, imageBase64, locations);
  };

  // Read the file as base64
  reader.readAsDataURL(file);
}
async function uploadProfile(account_fkid, location, photo, name) {
  try {
    const response = await fetch("http://localhost:3000/api/v1/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account_fkid,
        name,
        photo,
        location,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to upload profile");
    }

    const responseData = await response.json();
    const insertId = responseData.results.insertId;

    alert("Profile uploaded successfully!");
    sessionStorage.setItem("profile_id", insertId);
    window.location.href = "./home.html";
  } catch (error) {
    console.error("Error uploading profile:", error);
    alert("Failed to upload profile. Please try again.");
  }
}

async function getProfile(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/profile/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    console.log(data);

    return data; // Return the data variable
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return null; // Return null in case of error
  }
}

async function editProfile() {
  const id = sessionStorage.getItem("user_id");
  const body = {
    name: document.getElementById("name").value,
    location: document.getElementById("location").value,
    photo: document.getElementById("photo").value,
  };
  await fetch(`http://localhost:3000/api/v1/profile/${id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == "OK") {
        alert("Updated Succesfully");
        location.reload();
      }
    });
}

// Gallery //

async function gallery() {
  const user_id = sessionStorage.getItem("user_id");
  const image = document.getElementById("image").value;
  const description = document.getElementById("description").value;

  // Read the selected image file as base64
  const file = image.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const imageBase64 = event.target.result;

    // Make the fetch request with the base64 image data
    uploadGallery(user_id, imageBase64, description);
  };

  // Read the file as base64
  reader.readAsDataURL(file);
}

async function uploadGallery(account_fkid, image, description) {
  try {
    const response = await fetch("http://localhost:3000/api/v1/gallery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account_fkid,
        image,
        description,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to upload profile");
    }

    alert("Profile uploaded successfully!");
    window.location.href = "./gallery.html";
  } catch (error) {
    console.error("Error uploading profile:", error);
    alert("Failed to upload profile. Please try again.");
  }
}

async function getGallery() {
  const id = sessionStorage.getItem("user_id");
  try {
    const response = await fetch(`http://localhost:3000/api/v1/gallery/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    console.log(data);

    return data; // Return the data variable
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return null; // Return null in case of error
  }
}

async function editGallery() {
  const id = sessionStorage.getItem("user_id");
  const body = {
    image: document.getElementById("image").value,
  };
  await fetch(`http://localhost:3000/api/v1/gallery/${id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == "OK") {
        alert("Updated Succesfully");
        location.reload();
      }
    });
}

// Service //

async function uploadService() {
  const profile_fkid = sessionStorage.getItem("profile_id");
  const name_of_service = document.getElementById("nameofservice").value;
  const description = document.getElementById("description").value;

  try {
    const response = await fetch("http://localhost:3000/api/v1/service", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profile_fkid,
        name_of_service,
        description,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to service profile");
    }

    alert("Service uploaded successfully!");
  } catch (error) {
    console.error("Error service :", error);
    alert("Failed to upload service. Please try again.");
  }
}

async function getService(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/service/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    console.log(data);

    return data; // Return the data variable
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return null; // Return null in case of error
  }
}

async function editService(id) {
  const body = {
    name_of_service: document.getElementById("nameofservice").value,
    description: document.getElementById("description").value,
  };
  await fetch(`http://localhost:3000/api/v1/service/${id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == "OK") {
        alert("Updated Succesfully");
        location.reload();
      }
    });
}

// Startup_Info //

async function uploadStartup() {
  const profile_fkid = 1;
  const name = "Aedrian Jeao De Torres";
  const title = document.getElementById("titlestart").value;
  const description = document.getElementById("descstart").value;
  const escapedDescription = description.replace(/'/g, "''");
  const link = document.getElementById("link").value;

  try {
    const response = await fetch("http://localhost:3000/api/v1/startup-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profile_fkid,
        title,
        name,
        description: escapedDescription,
        link,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to service profile");
    }

    alert("Startup uploaded successfully!");
    location.reload();
  } catch (error) {
    console.error("Error service :", error);
    alert("Failed to upload service. Please try again.");
  }
}

async function getStartup(id) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/startup-info/${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    console.log(data);

    return data; // Return the data variable
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return null; // Return null in case of error
  }
}

async function deleteStartup(id) {
  // Prompt the user for confirmation
  const confirmed = confirm(
    "Are you sure you want to delete this startup information?"
  );

  if (!confirmed) {
    return; // If the user cancels the confirmation, exit the function
  }

  var condition = `id = ${id} AND profile_fkid = 1`; // Ensure no spaces in the condition
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/startup-info/${condition}`,
      {
        method: "DELETE",
      }
    );

    console.log("Response status:", response.status); // Log the response status

    if (response.status === 200) {
      location.reload(); // Reload the page upon successful deletion
    } else {
      throw new Error("Failed to delete engagement");
    }
  } catch (error) {
    console.error("Error deleting engagement:", error);
    // Handle the error here (e.g., show an error message to the user)
  }
}

async function VieweditStartup(id) {
  var titleInput = document.getElementById("titlestart1");
  var descInput = document.getElementById("descstart1");
  var linkInput = document.getElementById("link1");
  var submitContainer = document.getElementById("submit");

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/startup-info/post/${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();



    titleInput.value = data.results[0].title;
    descInput.value = data.results[0].description;
    linkInput.value = data.results[0].link;

    submitContent = `<button type="button" class="btn btn-primary" onclick="editStartup(${id})">Edit</button>`;

    submitContainer.innerHTML = submitContent;
  } catch (error) {
    console.error("Error editing startup:", error);
    // Handle the error here (e.g., show an error message to the user)
  }
}

async function editStartup(id) {
  // Prompt the user for confirmation
  const confirmed = confirm(
    "Are you sure you want to edit this startup information?"
  );

  if (!confirmed) {
    return; // If the user cancels the confirmation, exit the function
  }

  description = document.getElementById("descstart1").value;
  const escapedDescription = description.replace(/'/g, "''");

  const body = {
    title: document.getElementById("titlestart1").value,
    description: escapedDescription,
    link: document.getElementById("link1").value,
  };

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/startup-info/${id}`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      alert("Updated Successfully");
      location.reload();
    } else {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to update home content");
    }
  } catch (error) {
    console.error("Error updating home content:", error);
    alert("Failed to update home content. Please try again.");
  }
}


// Home Content

async function homecontent() {
  const user_id = sessionStorage.getItem("user_id");
  const type = document.getElementById("type").value;
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const image = document.getElementById("image").value;

  // Read the selected image file as base64
  const file = image.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const imageBase64 = event.target.result;

    // Make the fetch request with the base64 image data
    uploadHome(user_id, type, title, content, imageBase64);
  };

  // Read the file as base64
  reader.readAsDataURL(file);
}

async function uploadHome(account_fkid, type, title, content, image) {
  try {
    const response = await fetch("http://localhost:3000/api/v1/home-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account_fkid,
        type,
        title,
        content,
        image,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to upload profile");
    }

    alert("Profile uploaded successfully!");
    window.location.href = "./gallery.html";
  } catch (error) {
    console.error("Error uploading profile:", error);
    alert("Failed to upload profile. Please try again.");
  }
}

async function getHome(id) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/home-content/${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    console.log(data);

    return data; // Return the data variable
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return null; // Return null in case of error
  }
}

async function editHome(id) {
  const imageInput = document.getElementById("image");
  const imageFile = imageInput.files[0];

  if (!imageFile) {
    alert("Please select an image");
    return;
  }

  const reader = new FileReader();

  reader.onload = async function (event) {
    const imageDataUrl = event.target.result;

    const body = {
      type: document.getElementById("type").value,
      title: document.getElementById("title").value,
      content: document.getElementById("content").value,
      image: imageDataUrl,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/home-content/${id}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        alert("Updated Successfully");
        location.reload();
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to update home content");
      }
    } catch (error) {
      console.error("Error updating home content:", error);
      alert("Failed to update home content. Please try again.");
    }
  };

  reader.readAsDataURL(imageFile);
}

// Conversation

async function conversation() {
  const message_fkid = sessionStorage.getItem("message_id");
  const message_content = document.getElementById("message").value;
  const sender = document.getElementById("sender").value;
  const image = document.getElementById("image").value;

  // Read the selected image file as base64
  const file = image.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const imageBase64 = event.target.result;

    // Make the fetch request with the base64 image data
    uploadConvo(message_fkid, message_content, sender, imageBase64);
  };

  // Read the file as base64
  reader.readAsDataURL(file);
}

async function uploadConvo(message_fkid, message_content, sender, image) {
  try {
    const response = await fetch("http://localhost:3000/api/v1/conversation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message_fkid,
        message_content,
        sender,
        image,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to upload profile");
    }

    alert("Profile uploaded successfully!");
    window.location.href = "./gallery.html";
  } catch (error) {
    console.error("Error uploading profile:", error);
    alert("Failed to upload profile. Please try again.");
  }
}

async function getConvo(id) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/conversation/${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    console.log(data);

    return data; // Return the data variable
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return null; // Return null in case of error
  }
}

async function editConvo(id) {
  const imageInput = document.getElementById("image");
  const imageFile = imageInput.files[0];

  const reader = new FileReader();

  reader.onload = async function (event) {
    const imageDataUrl = event.target.result;

    const body = {
      message_content: document.getElementById("message").value,
      image: imageDataUrl || null, // Set image to imageDataUrl if it's truthy, otherwise set it to null
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/conversation/${id}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        alert("Updated Successfully");
        location.reload();
      } else {
        const errorMessage = await response.text();
        throw new Error(
          errorMessage || "Failed to update conversation content"
        );
      }
    } catch (error) {
      console.error("Error updating conversation content:", error);
      alert("Failed to update conversation content. Please try again.");
    }
  };

  if (!imageFile) {
    // If no file is selected, proceed with the FileReader without alerting the user
    reader.onload(null);
  } else {
    reader.readAsDataURL(imageFile);
  }
}

//Message

async function uploadMessage() {
  const profile_fkid = sessionStorage.getItem("profile_id");
  const profile_fkid1 = sessionStorage.getItem("profile_id1");
  const account_fkid = sessionStorage.getItem("account_id");
  const account_fkid1 = sessionStorage.getItem("account_id1");
  const room = generateRoomId(8);

  try {
    const response = await fetch("http://localhost:3000/api/v1/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profile_fkid,
        room,
        account_fkid,
        account_fkid1,
        profile_fkid1,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to service profile");
    }

    alert("Service uploaded successfully!");
  } catch (error) {
    console.error("Error service :", error);
    alert("Failed to upload service. Please try again.");
  }
}

async function getMessage(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/message/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    console.log(data);

    return data; // Return the data variable
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return null; // Return null in case of error
  }
}

async function editMessage() {
  const id = sessionStorage.getItem("profile_id");
  const body = {};
  await fetch(`http://localhost:3000/api/v1/message/${id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message == "OK") {
        alert("Updated Succesfully");
        location.reload();
      }
    });
}

function generateRoomId(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let roomId = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomId += characters.charAt(randomIndex);
  }

  return roomId;
}

//Community
