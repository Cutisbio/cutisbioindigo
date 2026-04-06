import Image, { ImageProps } from 'next/image';

interface StrictImageProps extends Omit<ImageProps, 'alt'> {
  // alt 속성을 필수로 강제합니다.
  alt: string;
}

export default function StrictImage({ alt, ...props }: StrictImageProps) {
  if (!alt || alt.trim() === '') {
    // 개발 모드에서 명시적으로 오류를 발생시키거나 경고를 줍니다.
    if (process.env.NODE_ENV !== 'production') {
      console.warn('StrictImage Component: "alt" 속성은 비워둘 수 없으며 반드시 설명적이어야 합니다.');
    }
  }

  return <Image alt={alt} {...props} />;
}
