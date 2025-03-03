function format(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
}
const likeBtn = document.querySelector("#like-btn");
const likeCountEl = document.querySelector("#like-count");
const postId = Number(likeBtn.dataset.postid);
const commentsContainer = document.querySelector("#comments-container");
const commentForm = document.querySelector("#comment-form");
const commentInput = document.querySelector("#comment-input");
const replyContainer = document.querySelector("#reply-container");

// 첫 로드 시 댓글 가져오기
async function main() {
    try {
        const response = await fetch(`/post/${postId}/comment`, {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error("댓글 작성 에러");
        }
        const { comments, user } = await response.json();
        renderComments(comments, user);
    } catch (err) {
        console.error(err);
        alert("에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
}

main();

// 하트 버튼 누를 시
likeBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`/post/${postId}/like`, { method: "POST" });
        if (!response.ok) {
            throw new Error("하트 누르기 에러");
        }
        const { isLiked, likeCount } = await response.json();
        if (isLiked) {
            likeBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        } else {
            likeBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
        }
        likeCountEl.textContent = likeCount;
    } catch (error) {
        console.err(error);
        alert("에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }

})

// 댓글 새로 랜더링하는 함수
function renderComments(comments, user) {
    commentsContainer.innerHTML = comments.map(comment => {
        let html = '';
        if (!comment.is_deleted) {
            html = `<div class="comment" data-id="${comment.id}">
                <div class="username-closeBtn">
                    <div class="username">${comment.username}</div>
                    ${(user.id === comment.user_id || user.is_admin)
                    ? `<button class="delete-comment-btn" data-id=${comment.id}>X</button>`
                    : ''}
                </div>
                <pre>${comment.content}</pre>
                <div class="date">${format(new Date(comment.created_at))}</div>
            </div>`
        } else if (comment.replies.length > 0) {
            // 대댓글이 있을 시
            html = `
            <div class="deleted">
                삭제된 댓글입니다.
            <div>
            `
        }

        comment.replies.forEach(reply => {
            if (!reply.is_deleted) {
                html += `<div class="reply"">
                <i class="fa-solid fa-arrow-right-long reply-arrow"></i>
                <div class="username-closeBtn">
                    <div class="username">${reply.username}</div>
                    ${(user.id === reply.user_id || user.is_admin)
                        ? `<button class="delete-comment-btn" data-id=${reply.id}>X</button>`
                        : ''}
                </div>
                <pre>${reply.content}</pre>
                <div class="date">${format(new Date(reply.created_at))}</div>
            </div>`
            }

        })
        return html;
    }).join('');
}

// 댓글 작성 시
commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const content = commentInput.value;
        const response = await fetch(`/post/${postId}/comment/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content })
        });
        if (!response.ok) {
            throw new Error("댓글 작성 에러");
        }
        commentInput.value = '';
        const { comments, user } = await response.json();
        renderComments(comments, user);
    } catch (err) {
        console.error(err);
        alert("에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
})


document.addEventListener("click", async (e) => {
    if (e.target.matches(".delete-comment-btn")) {
        // 댓글 삭제
        e.preventDefault();
        try {
            if (confirm("댓글을 삭제하시겠습니까?")) {
                const commentId = Number(e.target.dataset.id);
                const response = await fetch(`/post/${postId}/comment/${commentId}/delete`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                });
                if (!response.ok) {
                    throw new Error("댓글 삭제 에러");
                }
                const { comments, user } = await response.json();
                renderComments(comments, user);
            }
        } catch (err) {
            console.error(err);
            alert("에러가 발생했습니다. 잠시 후 다시 시도해주세요.")
        }
    } else if (e.target.closest(".comment")) {
        // 대댓글 작성창 띄우기
        // <form class="reply-container" id="reply-form">
        //     <textarea name="replyContent" id="reply-input" placeholder="댓글을 입력하세요."></textarea>
        //     <button type="submit" id="reply-btn">등록</button>
        // </form>
        let replyContainer = document.querySelector("#reply-form");
        if (replyContainer) {
            replyContainer.remove();
        }

        replyContainer = document.createElement("form");
        replyContainer.classList.add("reply-container");
        replyContainer.id = "reply-form";
        replyContainer.dataset.parentId = e.target.closest(".comment").dataset.id;
        replyContainer.innerHTML = `
        <textarea name="replyContent" id="reply-input" placeholder="대댓글을 입력하세요." required></textarea>
        <button type="submit" id="reply-btn">등록</button>
        `
        // 대댓글 작성 시
        replyContainer.addEventListener("submit", async (e) => {
            e.preventDefault();
            try {
                const replyInput = document.querySelector("#reply-input");
                const replyContent = replyInput.value;
                const response = await fetch(`/post/${postId}/reply/create?originalComment=${replyContainer.dataset.parentId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ replyContent })
                });
                if (!response.ok) {
                    throw new Error("댓글 작성 에러");
                }
                replyInput.value = '';
                const { comments, user } = await response.json();
                renderComments(comments, user);
            } catch (err) {
                console.error(err);
                alert("에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
            }
        })

        e.target.closest(".comment").after(replyContainer);
    }
})