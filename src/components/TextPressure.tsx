import { useEffect, useRef, useState } from 'react';

interface TextPressureProps {
    text?: string;
    fontFamily?: string;
    fontUrl?: string;
    width?: boolean;
    weight?: boolean;
    italic?: boolean;
    alpha?: boolean;
    flex?: boolean;
    stroke?: boolean;
    scale?: boolean;
    textColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    className?: string;
    minFontSize?: number;
}

const TextPressure: React.FC<TextPressureProps> = ({
    text = 'IN STYLE BD',
    fontFamily = 'Inter, system-ui, sans-serif',
    fontUrl = '',
    width = true,
    weight = true,
    italic = true,
    alpha = false,
    flex = true,
    stroke = false,
    scale = false,
    textColor = '#D4AF37',
    strokeColor = '#FF0000',
    strokeWidth = 2,
    className = '',
    minFontSize = 32,
}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const spansRef = useRef<(HTMLSpanElement | null)[]>([]);

    const mouseRef = useRef({ x: 0, y: 0 });
    const cursorRef = useRef({ x: 0, y: 0 });

    const [fontSize, setFontSize] = useState(minFontSize);
    const [scaleY, setScaleY] = useState(1);
    const [lineHeight, setLineHeight] = useState(1);

    const chars = text.split('');

    const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            cursorRef.current.x = e.clientX;
            cursorRef.current.y = e.clientY;
        };
        const handleTouchMove = (e: TouchEvent) => {
            const t = e.touches[0];
            cursorRef.current.x = t.clientX;
            cursorRef.current.y = t.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });

        if (containerRef.current) {
            const { left, top, width, height } = containerRef.current.getBoundingClientRect();
            mouseRef.current.x = left + width / 2;
            mouseRef.current.y = top + height / 2;
            cursorRef.current.x = mouseRef.current.x;
            cursorRef.current.y = mouseRef.current.y;
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    const setSize = () => {
        if (!containerRef.current || !titleRef.current) return;

        const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

        let newFontSize = containerW / (chars.length / 2.5);
        newFontSize = Math.max(newFontSize, minFontSize);
        newFontSize = Math.min(newFontSize, 120); // Max font size

        setFontSize(newFontSize);
        setScaleY(1);
        setLineHeight(1);

        requestAnimationFrame(() => {
            if (!titleRef.current) return;
            const textRect = titleRef.current.getBoundingClientRect();

            if (scale && textRect.height > 0) {
                const yRatio = containerH / textRect.height;
                setScaleY(yRatio);
                setLineHeight(yRatio);
            }
        });
    };

    useEffect(() => {
        setSize();
        window.addEventListener('resize', setSize);
        return () => window.removeEventListener('resize', setSize);
    }, [scale, text, chars.length]);

    useEffect(() => {
        let rafId: number;
        const animate = () => {
            mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
            mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

            if (titleRef.current) {
                const titleRect = titleRef.current.getBoundingClientRect();
                const maxDist = Math.max(titleRect.width / 2, 200);

                spansRef.current.forEach((span) => {
                    if (!span) return;

                    const rect = span.getBoundingClientRect();
                    const charCenter = {
                        x: rect.x + rect.width / 2,
                        y: rect.y + rect.height / 2,
                    };

                    const d = dist(mouseRef.current, charCenter);

                    const getAttr = (distance: number, minVal: number, maxVal: number) => {
                        const val = maxVal - Math.abs((maxVal * distance) / maxDist);
                        return Math.max(minVal, val + minVal);
                    };

                    const wdth = width ? Math.floor(getAttr(d, 75, 125)) : 100;
                    const wght = weight ? Math.floor(getAttr(d, 300, 900)) : 400;
                    const italVal = italic ? getAttr(d, 0, 1).toFixed(2) : '0';
                    const alphaVal = alpha ? getAttr(d, 0.3, 1).toFixed(2) : '1';

                    span.style.opacity = alphaVal;
                    span.style.fontWeight = wght.toString();
                    span.style.fontStretch = `${wdth}%`;
                    span.style.fontStyle = parseFloat(italVal) > 0.5 ? 'italic' : 'normal';
                    
                    // For variable fonts
                    if (fontUrl) {
                        span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
                    }
                });
            }

            rafId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(rafId);
    }, [width, weight, italic, alpha, chars.length, fontUrl]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden bg-transparent"
        >
            {fontUrl && (
                <style>{`
                    @font-face {
                        font-family: '${fontFamily}';
                        src: url('${fontUrl}');
                        font-style: normal;
                    }
                `}</style>
            )}
            
            <style>{`
                .stroke span {
                    position: relative;
                    color: ${textColor};
                }
                .stroke span::after {
                    content: attr(data-char);
                    position: absolute;
                    left: 0;
                    top: 0;
                    color: transparent;
                    z-index: -1;
                    -webkit-text-stroke-width: ${strokeWidth}px;
                    -webkit-text-stroke-color: ${strokeColor};
                }
            `}</style>

            <h1
                ref={titleRef}
                className={`text-pressure-title ${className} ${flex ? 'flex justify-between' : ''
                    } ${stroke ? 'stroke' : ''} uppercase text-center select-none whitespace-nowrap`}
                style={{
                    fontFamily,
                    fontSize: fontSize,
                    lineHeight,
                    transform: `scale(1, ${scaleY})`,
                    transformOrigin: 'center top',
                    margin: 0,
                    fontWeight: 400,
                    color: stroke ? undefined : textColor,
                    letterSpacing: '0.05em',
                }}
            >
                {chars.map((char, i) => (
                    <span
                        key={i}
                        ref={(el) => (spansRef.current[i] = el)}
                        data-char={char}
                        className="inline-block transition-all duration-75 ease-out"
                        style={{
                            color: stroke ? undefined : textColor,
                        }}
                    >
                        {char}
                    </span>
                ))}
            </h1>
        </div>
    );
};

export default TextPressure;