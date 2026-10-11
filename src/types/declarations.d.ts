declare module 'lucide-react' {
  import * as React from 'react';

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    strokeWidth?: number | string;
    color?: string;
    className?: string;
  }

  export type LucideIcon = React.ForwardRefExoticComponent<LucideProps & React.RefAttributes<SVGSVGElement>>;

  export const Compass: LucideIcon;
  export const BookMarked: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Shield: LucideIcon;
  export const X: LucideIcon;
  export const Eye: LucideIcon;
  export const Cpu: LucideIcon;
  export const Database: LucideIcon;
  export const HeartHandshake: LucideIcon;
  export const Upload: LucideIcon;
  export const Camera: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Trash2: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const ImageIcon: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const Lightbulb: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const Bookmark: LucideIcon;
  export const HelpCircle: LucideIcon;
  export const ShieldAlert: LucideIcon;
  export const BookmarkCheck: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Calendar: LucideIcon;
  export const Search: LucideIcon;
  export const Filter: LucideIcon;
  export const Footprints: LucideIcon;
  export const Heart: LucideIcon;

  // Fallback for any other icon
  const icons: Record<string, LucideIcon>;
  export default icons;
}
