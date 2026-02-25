
export function getIconFallback(
    defaultValues,
    template,
    values,
) {
    const stateValue = (state) =>
        values[state] ?? defaultValues?.[state];
    return template
        .map((chunk) =>
            typeof chunk === 'string'
                ? chunk
                : 'values' in chunk
                    ? chunk.values[+!!stateValue(chunk.state)]
                    : stateValue(chunk.state)
        )
        .join('');
}
