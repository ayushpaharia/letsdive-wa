interface IEmojiProps {
  symbol: string
  label: string
}
export default function Emoji({ label, symbol }: IEmojiProps) {
  return (
    <span
      className="emoji"
      role="img"
      aria-label={label ? label : ""}
      aria-hidden={label ? "false" : "true"}
    >
      {symbol}
    </span>
  )
}
