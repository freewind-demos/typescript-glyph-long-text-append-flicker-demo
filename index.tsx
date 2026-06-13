import {
  Box,
  ScrollView,
  Text,
  type TextHandle,
  render,
  useApp,
  useInput,
} from "@semos-labs/glyph"
import {
  type FC,
  type RefObject,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

// 每行重复的基础句子
const baseSentence =
  "Glyph 用字符级 diff。观察长文本每秒只多一个字时，静态前缀会不会跟着闪。"

// 静态前缀行数
const staticPrefixLineCount = 120

// 会变区块行数
const growingLineCount = 120

// 每秒追加字符
const growChar = "字"

// 定时器间隔（毫秒）
const tickIntervalMs = 1000

// 生成静态前缀单行
const buildStaticLineText = (lineIndex: number): string => {
  return `[static ${String(lineIndex + 1).padStart(3, "0")}] ${baseSentence}`
}

// 生成会变区块单行
const buildGrowingLineText = (lineIndex: number): string => {
  return `[grow ${String(lineIndex + 1).padStart(3, "0")}] ${baseSentence}`
}

// 生成行数组
const buildLines = (
  lineCount: number,
  buildLine: (lineIndex: number) => string,
): string[] => {
  return Array.from({length: lineCount}, (_, lineIndex) => buildLine(lineIndex))
}

// 单行 Text
const BodyLine: FC<{line: string}> = memo(({line}) => {
  return <Text>{line}</Text>
})

// 静态前缀：无 state
const StaticPrefixBlock: FC = memo(() => {
  const lines = useMemo(
    () => buildLines(staticPrefixLineCount, buildStaticLineText),
    [],
  )

  return (
    <Box style={{flexDirection: "column"}}>
      <Text style={{dim: true}}>── 静态前缀（不应 re-render）──</Text>
      {lines.map((line, lineIndex) => (
        <BodyLine key={lineIndex} line={line} />
      ))}
    </Box>
  )
})

type GrowingLinesBlockProps = {
  followBottomRef: RefObject<boolean>
  isAutoScrollingRef: RefObject<boolean>
  lastLineRef: RefObject<TextHandle | null>
}

// 会变区块：仅最后一行 append
const GrowingLinesBlock: FC<GrowingLinesBlockProps> = ({
  followBottomRef,
  isAutoScrollingRef,
  lastLineRef,
}) => {
  const [lines, setLines] = useState(() =>
    buildLines(growingLineCount, buildGrowingLineText),
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setLines((currentLines) => {
        const nextLines = [...currentLines]
        const lastIndex = nextLines.length - 1
        nextLines[lastIndex] = `${nextLines[lastIndex]}${growChar}`
        return nextLines
      })
    }, tickIntervalMs)

    return () => {
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    if (!followBottomRef.current) {
      return
    }

    isAutoScrollingRef.current = true
    lastLineRef.current?.scrollIntoView({block: "end"})
  }, [lines, followBottomRef, isAutoScrollingRef, lastLineRef])

  return (
    <Box style={{flexDirection: "column", paddingTop: 1}}>
      <Text style={{dim: true}}>── 会变区块（仅最后一行 append）──</Text>
      {lines.map((line, lineIndex) =>
        lineIndex === lines.length - 1 ? (
          <Text key={lineIndex} ref={lastLineRef}>
            {line}
          </Text>
        ) : (
          <BodyLine key={lineIndex} line={line} />
        ),
      )}
    </Box>
  )
}

const App: FC = () => {
  const {exit} = useApp()
  const [scrollOffset, setScrollOffset] = useState(0)
  const [followBottom, setFollowBottom] = useState(true)
  const followBottomRef = useRef(true)
  const isAutoScrollingRef = useRef(false)
  const lastLineRef = useRef<TextHandle>(null)

  const scrollToBottom = useCallback(() => {
    followBottomRef.current = true
    setFollowBottom(true)
    isAutoScrollingRef.current = true
    lastLineRef.current?.scrollIntoView({block: "end"})
  }, [])

  const handleScroll = useCallback((offset: number) => {
    setScrollOffset(offset)
    if (isAutoScrollingRef.current) {
      isAutoScrollingRef.current = false
      return
    }

    followBottomRef.current = false
    setFollowBottom(false)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  useInput((key) => {
    if (key.name === "q" && !key.ctrl) {
      exit()
      return
    }

    if (key.name === "g" && !key.ctrl) {
      scrollToBottom()
    }
  })

  return (
    <Box style={{flexDirection: "column", height: "100%"}}>
      <Text style={{bold: true}}>Glyph 长文本 append 闪屏对比</Text>
      <Text style={{dim: true}}>
        上 {staticPrefixLineCount} 行静态 | 下 {growingLineCount} 行 | 每{" "}
        {tickIntervalMs / 1000}s 末行 +1「{growChar}」| 滚轮/↑↓ 回看 | g
        跟随底 | q 退出
        {followBottom ? "" : " | 回看中"}
      </Text>
      <ScrollView
        scrollOffset={scrollOffset}
        onScroll={handleScroll}
        scrollToFocus={false}
        style={{flexGrow: 1}}
        showScrollbar
      >
        <StaticPrefixBlock />
        <GrowingLinesBlock
          followBottomRef={followBottomRef}
          isAutoScrollingRef={isAutoScrollingRef}
          lastLineRef={lastLineRef}
        />
      </ScrollView>
    </Box>
  )
}

render(<App />)
