const authService = {

  login: (token, role, name, email) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("username", name);
    localStorage.setItem("email", email);
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  getRole: () => {
    return localStorage.getItem("role");
  },

  getUsername: () => {
    return localStorage.getItem("username");
  },

  getEmail: () => {
    return localStorage.getItem("email");
  },

  isLoggedIn: () => {
    return !!localStorage.getItem("token");
  }

};

export default authService;
