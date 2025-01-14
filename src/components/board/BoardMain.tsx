"use client"

import { deleteBoard, getArticleById, getBoardList, updateBoard } from "@/actions/board-action"
import { useUser } from "@/config/Providers"
import { BoardType } from "@/types/board"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { Comment } from "./Comment"

const SnmsCKEditor = dynamic(() => import("./CKEditor"), {
  loading: () => <div>...loading</div>,
  ssr: false,
})

type BoardDialogProps = {
  section: string
}

export function Board({ section }: BoardDialogProps) {
  const [boards, setBoards] = useState<Partial<BoardType>[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const queryClient = useQueryClient()
  const rowsPerPage = 10
  const [articleId, setArticleId] = useState<string | null>(null)
  const [article, setArticle] = useState<Partial<BoardType>>({})
  const [oriArticle, setOriArticle] = useState<Partial<BoardType>>({})
  const [isEditable, setIsEditable] = useState<boolean>(false)

  const currentUser = useUser()
  const searchParams = useSearchParams()
  const queryId = searchParams?.get("id") ?? ""

  const router = useRouter()

  const { data: boardsResult, isFetching: isLoadingBoards } = useQuery({
    queryKey: ["board", section, "BoardDialog", page], // 캐시 키
    queryFn: () => getBoardList({ section: section.toUpperCase(), page, rowsPerPage }),
  })

  const { data: articleResult, isFetching: isLoadingArticle } = useQuery({
    queryKey: ["article", articleId],
    queryFn: () => getArticleById({ board_seq: articleId ?? "" }),
    enabled: !!articleId,
  })
  const updateMutation = useMutation({
    mutationFn: () =>
      updateBoard({
        board_seq: articleId ?? "",
        section: section.toUpperCase(),
        title: article.title ?? "",
        content: article.content ?? "",
      }),
  })
  const deleteMutation = useMutation({
    mutationFn: (board_seq: string) => deleteBoard({ board_seq }),
  })

  useEffect(() => {
    setArticleId(queryId || null)
  }, [queryId])

  useEffect(() => {
    if (!boardsResult) {
      return
    }
    setBoards(boardsResult.data)
    setPage(boardsResult.currentPage)
    setTotalPages(boardsResult.totalPages)
  }, [boardsResult])

  useEffect(() => {
    if (!articleResult) {
      return
    }
    setArticle(articleResult)
    setOriArticle(articleResult)
  }, [articleResult])

  const hasAuth = useMemo(() => {
    return currentUser?.role_ids?.some((r) => r.toLowerCase() === "admin") ?? false
  }, [currentUser])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"

    const date = new Date(dateString)

    // 날짜가 유효한지 확인
    if (Number.isNaN(date.getTime())) return "N/A"

    // YYYY-MM-DD HH:MM 형식으로 변환
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0") // 월은 0부터 시작하므로 +1 필요
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  const handleAdd = () => {
    setArticleId("")
    setArticle({})
    setIsEditable(true)
  }

  const handleArticleBack = () => {
    if (!isEditable) {
      router.push(`/board/${section}`)
    } else if (!articleId) {
      setArticleId(null)
      setArticle({})
      setIsEditable(false)
    } else {
      setArticle(oriArticle)
      setIsEditable(false)
    }
  }

  const handleGoEdit = () => {
    setIsEditable(true)
  }

  const handleSave = () => {
    updateMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("저장했습니다.")
        queryClient.invalidateQueries({ queryKey: ["board", section] })
        queryClient.invalidateQueries({ queryKey: ["article", articleId] })
        handleArticleBack()
      },
      onError: (error) => {
        console.error("Error saving changes:", error)
      },
    })
  }

  const handleDelete = () => {
    if (!articleId) {
      toast.info("선택된 게시물이 없습니다.")
      return
    }
    deleteMutation.mutate(articleId, {
      onSuccess: () => {
        toast.success("삭제했습니다.")
        queryClient.invalidateQueries({ queryKey: ["board", section] })
        handleArticleBack()
      },
      onError: (error) => {
        console.error("Error saving changes:", error)
      },
    })
  }

  const handlePageChange = (c: number) => {
    setPage(c)
  }

  if (isLoadingBoards || isLoadingArticle) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "10rem",
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        "& .MuiDialog-paper": {
          height: "635px",
          maxHeight: "635px",
        },
      }}
    >
      {articleId === null && (
        <>
          <Box className="dark:text-white">목록</Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%", // 다이얼로그 전체 높이를 차지하게 설정
            }}
          >
            <TableContainer
              component={Paper}
              sx={{
                flexGrow: 1, // 테이블 컨텐츠가 가변적으로 크기를 차지하도록 설정
                overflowY: "auto", // 테이블 내용이 많을 경우 스크롤 가능하게 설정
              }}
              className="border dark:border-gray-700 dark:bg-black"
            >
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ height: "40px" }}>
                    <TableCell sx={{ paddingY: "0px", width: "70%" }} className="dark:text-white">
                      제목
                    </TableCell>
                    <TableCell sx={{ paddingY: "0px", width: "15%" }} className="dark:text-white">
                      작성자
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ paddingY: "0px", width: "15%" }}
                      className="dark:text-white"
                    >
                      날짜
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {boards.map((board) => (
                    <TableRow
                      className="h-10 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                      key={board.board_seq}
                    >
                      <TableCell sx={{ paddingY: "0px" }}>
                        <Link href={`/board/${section}?id=${board.board_seq}`}>
                          <Typography className="w-128 truncate dark:text-white">
                            {board.title}
                          </Typography>
                        </Link>
                      </TableCell>
                      <TableCell sx={{ paddingY: "0px" }}>
                        <Link href={`/board/${section}?id=${board.board_seq}`}>
                          <Typography className="truncate dark:text-white">
                            {board.create_user_name}
                          </Typography>
                        </Link>
                      </TableCell>
                      <TableCell align="right" sx={{ paddingY: "0px" }} className="dark:text-white">
                        <Link href={`/board/${section}?id=${board.board_seq}`}>
                          {formatDate(board.create_date ?? "")}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Pagination
                count={totalPages} // 전체 페이지 수
                page={page} // 현재 페이지
                onChange={(_, value) => handlePageChange(value)} // 페이지 변경 시 호출되는 함수
                color="primary"
                className="dark:text-white"
                shape="rounded"
              />
            </Box>
            {hasAuth && (
              <Box className="pt-2 dark:bg-black">
                <Button onClick={handleAdd}>추가</Button>
              </Box>
            )}
          </Box>
        </>
      )}
      {articleId !== null && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <Button onClick={handleArticleBack} className="h-8 w-6 min-w-0 dark:text-white">
                <ChevronLeftIcon className="text-black" />
              </Button>
              <h3 className="ml-1 text-lg font-bold dark:text-white">게시글</h3>
            </div>

            <Box className="flex items-center justify-end gap-2">
              {article.create_user_name && (
                <Typography
                  variant="caption"
                  className="text-sm text-gray-400 dark:text-gray-400"
                >{`${article.create_user_name} / ${formatDate(article.create_date ?? "")}`}</Typography>
              )}

              {/* Dialog Actions */}
              <Box className="flex justify-end" gap={1}>
                {isEditable && (
                  <Button onClick={handleSave} color="primary" variant="outlined">
                    저장
                  </Button>
                )}
                {articleId !== "" && hasAuth && !isEditable && (
                  <Button onClick={handleGoEdit} color="primary" variant="outlined">
                    수정
                  </Button>
                )}
                {articleId !== "" && hasAuth && !isEditable && (
                  <Button onClick={handleDelete} color="error" variant="outlined">
                    삭제
                  </Button>
                )}
              </Box>
            </Box>
          </div>
          <Box
            key={`${String(isEditable)}${articleId ?? "new"}`}
            sx={{
              display: "flex",
              flexDirection: "column",
              // padding: "36px", // 내부 패딩 추가
            }}
          >
            {/* 제목 */}
            <TextField
              className="board-tit mb-1 mt-2"
              fullWidth
              value={article.title || ""}
              onChange={(e) => setArticle({ ...article, title: e.target.value })}
              slotProps={{
                input: {
                  readOnly: !isEditable,
                },
              }}
            />

            {/* 내용 */}
            <div className="board_con">
              <SnmsCKEditor
                content={article.content ?? ""}
                isEditable={isEditable}
                handleSave={(c) => {
                  setArticle((prevArticle) => {
                    if (prevArticle.content === c) return prevArticle // 상태가 동일하면 업데이트 방지
                    return { ...prevArticle, content: c }
                  })
                }}
              />
            </div>
          </Box>

          {!isEditable && (
            <>
              <Divider sx={{ my: 2 }} />
              <Comment boardId={articleId} />
            </>
          )}
        </>
      )}
    </Box>
  )
}
