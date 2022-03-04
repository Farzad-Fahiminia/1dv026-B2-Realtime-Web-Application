// import '../socket.io/socket.io.js'

const issueTemplate = document.querySelector('#issue-template')

// If taskTemplate is not present on the page, just ignore and do not listen for task messages.
if (issueTemplate) {
  await import('../socket.io/socket.io.js')

  // Create a socket connection using Socket.IO.

  // 👎 BAD PROGRAMMER, NO DONUT!
  // CAUSE: Does not work with subdirectories.
  // const socket = window.io()

  // 🎉 This should work with any subdirectory.
  const base = document.querySelector('base')
  const path = base
    ? (new URL('socket.io', base.href)).pathname
    : '/socket.io'
  const socket = window.io.connect('/', { path })

  // Listen for "issue/update" message from the server.
  socket.on('issue/update', (issue) => updateIssue(issue))
  socket.on('issue/create', (issue) => createIssue(issue))
}

/**
 * Changes the state on open/close button.
 *
 * @param {object} issue - The specific issue to modify.
 */
function updateIssue (issue) {
  const issueId = document.querySelector(`.issues-form[name="${issue.iid}"]`)
  const button = issueId.querySelector('#issueSubmit')

  if (issue.state === 'closed') {
    button.setAttribute('class', 'button-open')
    button.textContent = 'Open'
  } else if (issue.state === 'opened') {
    button.setAttribute('class', 'button-close')
    button.textContent = 'Close'
  }
}

/**
 * Creates a new issue through template in index.ejs.
 *
 * @param {object} issue - The specific issue to modify.
 */
function createIssue (issue) {
  const issueForm = document.querySelector('.issues-form')
  const title = document.querySelector('.issue-title')
  const img = document.querySelector('.img-avatar')
  const description = document.querySelector('.issue-description')
  const author = document.querySelector('#issue-author')
  const hidden = document.querySelector('#issueStatus')
  const button = document.querySelector('#issueSubmit')

  issueForm.setAttribute('name', `${issue.iid}`)
  issueForm.setAttribute('action', `./issues/${issue.iid}/update`)
  title.textContent = `#${issue.iid}. ${issue.title}`
  img.setAttribute('src', `${issue.avatar}`)
  description.textContent = `${issue.description}`
  author.textContent = `Author: ${issue.author}, State: ${issue.state}`
  hidden.setAttribute('value', `${issue.state}`)
  button.setAttribute('value', `${issue.iid}`)

  if (issue.state === 'closed') {
    button.setAttribute('class', 'button-open')
    button.textContent = 'Open'
  } else if (issue.state === 'opened') {
    button.setAttribute('class', 'button-close')
    button.textContent = 'Close'
  }
}
