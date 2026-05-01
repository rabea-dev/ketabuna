import clsx from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'forest' | 'navy' | 'gold' | 'stone' | 'article' | 'book'
  className?: string
}

export default function Badge({ children, variant = 'forest', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-block text-xs font-plex font-semibold px-2.5 py-0.5 rounded-sm tracking-wide',
        {
          'bg-forest text-white': variant === 'forest',
          'bg-navy text-white': variant === 'navy',
          'bg-gold text-white': variant === 'gold',
          'bg-stone text-ink-muted': variant === 'stone',
          'bg-forest/10 text-forest border border-forest/20': variant === 'article',
          'bg-navy/10 text-navy border border-navy/20': variant === 'book',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
