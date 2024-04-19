export function FormError({ error }: { error?: string | null }) {
    if (!error) return;

    return <p>{error}</p>
}

export function FormSuccess({ message }: { message?: string | null }) {
    if (!message) return;

    return <p>{message}</p>
}