import React from "react";
import { ClarityCard } from "./clarity-ui/ClarityCard";
import { ClarityText } from "./clarity-ui/ClarityText";
import { ClarityContainer } from "./clarity-ui/ClarityContainer";
import { ClarityButton } from "./clarity-ui/ClarityButton";
import { ClarityList } from "./clarity-ui/ClarityList";

interface DynamicRendererProps {
    content: string | null;
}

export function DynamicRenderer({ content }: DynamicRendererProps) {
    if (!content) return null;

    let safelyParsed: any = null;
    try {
        safelyParsed = JSON.parse(content);
        // Clean up markdown code blocks if gemini included them
        if (typeof safelyParsed === 'string') {
             // In case it was double stringified or somehow wrapper in markdown
             // Simple heuristic for now
        }
    } catch (e) {
        // Retry with cleanup
        try {
            const cleanContent = content.replace(/```json\n|\n```/g, "").trim();
            safelyParsed = JSON.parse(cleanContent);
        } catch (e2) {
            console.error("JSON Parsing failed", e2);
            return <div className="p-4 text-red-400 border border-red-900 rounded bg-red-900/10">Failed to parse UI.</div>;
        }
    }

    if (!safelyParsed || !safelyParsed.components) {
        return <div className="p-4 text-yellow-400">Invalid UI format.</div>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto pb-20 fade-in">
            {safelyParsed.components.map((comp: any, i: number) => (
                <Renderer key={i} component={comp} />
            ))}
        </div>
    );
}

function Renderer({ component }: { component: any }) {
    if (!component || !component.type) return null;

    switch (component.type) {
        case "container":
            return (
                <ClarityContainer layout={component.layout} gap={component.gap} className={component.className}>
                    {component.children?.map((child: any, i: number) => (
                        <Renderer key={i} component={child} />
                    ))}
                </ClarityContainer>
            );
        case "card":
            return (
                <ClarityCard title={component.title} className={component.className}>
                    {component.body && <ClarityText>{component.body}</ClarityText>}
                    {component.children?.map((child: any, i: number) => (
                        <Renderer key={i} component={child} />
                    ))}
                </ClarityCard>
            );
        case "text":
            return (
                <ClarityText variant={component.variant || 'body'} className={component.className}>
                    {component.content}
                </ClarityText>
            );
        case "button":
            return (
                <ClarityButton 
                    label={component.label} 
                    actionToken={component.actionToken} 
                    variant={component.variant} 
                    icon={component.icon}
                />
            );
        case "header":
             return <ClarityText variant="h1">{component.content}</ClarityText>;
        case "list":
             return (
                 <ClarityList className={component.className}>
                     {component.children?.map((child: any, i: number) => (
                         <li key={i}><Renderer component={child} /></li>
                     ))}
                 </ClarityList>
             );
        default:
            return <div className="text-xs text-red-500 border border-red-500/20 p-1">Unknown: {component.type}</div>;
    }
}
