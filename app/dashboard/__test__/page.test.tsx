import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DashboardPage from '../page'
import { getIssues } from '@/lib/dal'
import { ISSUE_STATUS, ISSUE_PRIORITY } from '@/db/schema'
import { Status, Priority } from '@/lib/types'

// Mock the dependencies
vi.mock('@/lib/dal', () => ({
  getIssues: vi.fn(),
  getCurrentUser: vi.fn(),
}))

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
  }: {
    href: string
    children: React.ReactNode
  }) => (
    <a href={href} data-testid="next-link">
      {children}
    </a>
  ),
}))

// Mock the formatRelativeTime function
vi.mock('@/lib/utils', () => ({
  formatRelativeTime: vi.fn(() => '2 days ago'),
  cn: vi.fn((...args) => args.join(' ')),
}))

describe('Dsahboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('it renders the issus list when issues are available', async () => {
    const mockIssues = [
      {
        id: 1,
        title: 'Test Issue 1',
        description: 'Test description',
        status: 'todo' as Status,
        priority: 'medium' as Priority,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user1',
        user: {
          id: 'user1',
          email: 'user1@example.com',
          password: 'hashed-password',
          createdAt: new Date(),
        },
      },
      {
        id: 2,
        title: 'Test Issue 2',
        description: null,
        status: 'in_progress' as Status,
        priority: 'high' as Priority,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user2',
        user: {
          id: 'user2',
          email: 'user2@example.com',
          password: 'hashed-password',
          createdAt: new Date(),
        },
      },
    ]

    vi.mocked(getIssues).mockResolvedValue(mockIssues)

    render(await DashboardPage())

    // Assertions
    expect(screen.getByText('Issues')).toBeInTheDocument()
    expect(screen.getByText('Test Issue 1')).toBeInTheDocument()
    expect(screen.getByText('Test Issue 2')).toBeInTheDocument()
    expect(screen.getByText(ISSUE_STATUS.todo.label)).toBeInTheDocument()
    expect(screen.getByText(ISSUE_STATUS.in_progress.label)).toBeInTheDocument()
    expect(screen.getByText(ISSUE_PRIORITY.medium.label)).toBeInTheDocument()
    expect(screen.getByText(ISSUE_PRIORITY.high.label)).toBeInTheDocument()
    expect(screen.getAllByText('2 days ago')).toHaveLength(2)
  })
})
