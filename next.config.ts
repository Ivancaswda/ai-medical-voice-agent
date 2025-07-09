
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true, // ✅ Пропускает ошибки типов
    },
    eslint: {
        ignoreDuringBuilds: true, // ✅ Пропускает ESLint при build
    },
    images: {
        domains: ['cdn.pixabay.com'],
    },
}

export default nextConfig