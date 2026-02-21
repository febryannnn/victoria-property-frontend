const API_URL = "https://vp-backend-production-2fef.up.railway.app/" // sesuaikan path kamu

export async function imageFetch<T>(
    path: string,
    formData: FormData
): Promise<T> {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
    });

    if (!res.ok) {
        throw new Error("Image upload failed");
    }

    return res.json();
}