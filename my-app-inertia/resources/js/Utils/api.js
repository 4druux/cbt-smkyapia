import axios from "axios";

export const register = async (userData) => {
    try {
        const response = await axios.post(route("api.register"), userData);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response;
        }
        throw new Error(
            "Terjadi kesalahan yang tidak diketahui saat registrasi."
        );
    }
};

export const login = async (credentials) => {
    try {
        const response = await axios.post(route("api.login"), credentials);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response;
        }
        throw new Error("Terjadi kesalahan yang tidak diketahui saat login.");
    }
};

export const logout = async () => {
    try {
        await axios.post(route("api.logout"));
    } catch (error) {
        console.error("Logout failed:", error);
        window.location.href = route("login");
    }
};
