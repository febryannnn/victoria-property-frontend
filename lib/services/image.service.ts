const API_URL = "http://localhost:8080" // sesuaikan path kamu

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