// Debug utility để kiểm tra authentication
export const debugAuth = () => {
  console.log("=== AUTH DEBUG INFO ===");
  console.log("localStorage access_token:", localStorage.getItem("access_token"));
  console.log("localStorage user:", localStorage.getItem("user"));
  
  const token = localStorage.getItem("access_token");
  const user = localStorage.getItem("user");
  
  if (token) {
    try {
      // Decode JWT token để xem thông tin
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("Token payload:", payload);
      console.log("Token expires at:", new Date(payload.exp * 1000));
      console.log("Token is expired:", new Date() > new Date(payload.exp * 1000));
    } catch (e) {
      console.log("Error decoding token:", e);
    }
  }
  
  if (user) {
    try {
      const userObj = JSON.parse(user);
      console.log("User object:", userObj);
    } catch (e) {
      console.log("Error parsing user:", e);
    }
  }
  
  console.log("=== END AUTH DEBUG ===");
};

// Function để clear tất cả auth data
export const clearAuth = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  console.log("Auth data cleared");
};

// Function để test token validity
export const testToken = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.log("No token found");
    return;
  }
  
  try {
    const response = await fetch("http://localhost:3000/auth/me", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    
    console.log("Token test response status:", response.status);
    if (response.ok) {
      const data = await response.json();
      console.log("Token test success:", data);
    } else {
      console.log("Token test failed:", response.status, response.statusText);
    }
  } catch (error) {
    console.log("Token test error:", error);
  }
};
