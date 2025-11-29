import { createContext, useContext, useReducer, useMemo } from 'react'

const NewsContext = createContext(null)

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateMockNews(count = 25) {
  const reporters = ['Alex Kim', 'Jordan Lee', 'Taylor Chen', 'Sam Rivera', 'Morgan Patel']
  const topics = [
    'City council announces new park initiative',
    'Tech company claims breakthrough in AI ethics',
    'Local sports team wins championship',
    'New study questions dietary guidelines',
    'Celebrity rumored to launch charity fund',
    'Unexpected weather pattern hits coastal area',
    'University publishes findings on mental health',
    'Startup raises seed round for climate tech',
    'Community organizes cleanup event',
    'Traffic reform proposal stirs debate',
  ]

  const items = []
  for (let i = 1; i <= count; i++) {
    const topic = `${randomItem(topics)} #${i}`
    const shortDetail = 'Short summary of the news, highlighting the core claim.'
    const fullDetail =
      'Full details of the event with more context, sources, and background information to help readers assess credibility. This includes quotes, references, and timeline of events.'
    const reporter = randomItem(reporters)
    const reportedAt = new Date(Date.now() - i * 3600_000).toISOString()
    const imageUrl = `https://picsum.photos/seed/news-${i}/640/360`

    const comments = []
    const votes = { fake: 0, not_fake: 0 }
    const names = ['Anonymous', 'Casey', 'Riley', 'Jamie', 'Avery', 'Quinn', 'Charlie']
    const reasons = [
      'Source seems unreliable',
      'No corroborating articles found',
      'Photo appears edited',
      'Official statement contradicts claim',
      'Trusted outlet reported similar facts',
      'Evidence attached supports authenticity',
      'Witness account conflicts with narrative',
    ]
    const initialComments = 8 + (i % 5) // 8-12 comments
    for (let c = 0; c < initialComments; c++) {
      const vote = Math.random() < 0.5 ? 'fake' : 'not_fake'
      votes[vote]++
      comments.push({
        id: `${i}-${c}`,
        voterName: randomItem(names),
        vote,
        commentText: randomItem(reasons),
        imageUrl: Math.random() < 0.4 ? `https://picsum.photos/seed/comment-${i}-${c}/320/180` : '',
        createdAt: new Date(Date.now() - (i * 3600_000 + c * 600_000)).toISOString(),
      })
    }

    items.push({
      id: String(i),
      topic,
      shortDetail,
      fullDetail,
      reporter,
      reportedAt,
      imageUrl,
      comments,
      votes,
    })
  }
  return items
}

function getStatusFromVotes(votes) {
  if (!votes) return 'Unverified'
  const { fake = 0, not_fake = 0 } = votes
  if (fake === not_fake) return 'Unverified'
  return fake > not_fake ? 'Fake' : 'Not Fake'
}

const initialState = {
  news: generateMockNews(25),
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_NEWS': {
      return { ...state, news: action.payload }
    }
    case 'ADD_VOTE': {
      const { newsId, vote, commentText, imageUrl } = action.payload
      const news = state.news.map((n) => {
        if (n.id !== newsId) return n
        const newComment = {
          id: `${newsId}-${n.comments.length + 1}`,
          voterName: 'Anonymous',
          vote,
          commentText: commentText || '',
          imageUrl: imageUrl || '',
          createdAt: new Date().toISOString(),
        }
        return {
          ...n,
          comments: [newComment, ...n.comments],
          votes: { ...n.votes, [vote]: (n.votes[vote] || 0) + 1 },
        }
      })
      return { ...state, news }
    }
    default:
      return state
  }
}

export function NewsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const value = useMemo(() => {
    return {
      news: state.news,
      setNews: (items) => dispatch({ type: 'SET_NEWS', payload: items }),
      addVote: (newsId, vote, commentText, imageUrl) =>
        dispatch({ type: 'ADD_VOTE', payload: { newsId, vote, commentText, imageUrl } }),
      getStatus: (n) => getStatusFromVotes(n.votes),
    }
  }, [state])

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>
}

export function useNews() {
  const ctx = useContext(NewsContext)
  if (!ctx) throw new Error('useNews must be used within NewsProvider')
  return ctx
}
