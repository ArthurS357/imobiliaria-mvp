export function getWatermarkedImage(url: string | null) {
    if (!url) return null;
    if (!url.includes("cloudinary.com")) return url;

    // SUBSTITUA PELO ID QUE VOCÊ DEFINIU NO CLOUDINARY
    const logoId = "logo_e7vocq";

    // Explicação dos parâmetros:
    // l_ -> define o ID da camada (sua logo)
    // w_300 -> define a largura da logo (ajuste para 400 ou 500 se ficar pequena)
    // o_20 -> opacidade 20% (bem discreta, como pediu)
    // g_center -> centraliza a logo na imagem

    const transformation = `l_${logoId},w_1700,o_20,g_center`;

    // Injeta a transformação na URL
    return url.replace("/upload/", `/upload/${transformation}/`);
}