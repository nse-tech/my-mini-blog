        // DOM elements
        const postForm = document.getElementById('post-form');
        const postsContainer = document.getElementById('posts-container');
        const clearPostsBtn = document.getElementById('clear-posts');
        const notification = document.getElementById('notification');
        const deleteModal = document.getElementById('deleteModal');
        const cancelDelete = document.getElementById('cancelDelete');
        const confirmDelete = document.getElementById('confirmDelete');

        // State variables
        let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        let currentPostId = null;
        let isEditing = false;

        // Show notification function
        function showNotification(message, isError = false) {
            notification.textContent = message;
            notification.className = 'notification' + (isError ? ' error' : '');
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Load posts from localStorage
        function loadPosts() {
            posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
            postsContainer.innerHTML = '';
            
            if (posts.length === 0) {
                postsContainer.innerHTML = '<p class="no-posts">No posts yet. Create your first post!</p>';
                return;
            }
            
            // Display posts in reverse order (newest first)
           [...posts].reverse().forEach((post) => {
                const postElement = document.createElement('div');
                postElement.className = 'post';
                postElement.setAttribute('data-id', post.id);
                postElement.innerHTML = `
                    <h3 class="post-title">${post.title}</h3>
                    <div class="post-meta">
                        <span class="post-date"><i class="far fa-calendar"></i> ${post.date}</span>
                        <span class="post-author"><i class="far fa-user"></i> ${post.author}</span>
                    </div>
                    <p class="post-content">${post.content}</p>
                    <div class="post-actions">
                        <button class="btn btn-edit" data-id="${post.id}"><i class="far fa-edit"></i> Edit</button>
                        <button class="btn btn-delete" data-id="${post.id}"><i class="far fa-trash-alt"></i> Delete</button>
                    </div>
                    <div class="edit-form" id="edit-form-${post.id}">
                        <h3>Edit Post</h3>
                        <div class="form-group">
                            <label for="edit-title-${post.id}">Title</label>
                            <input type="text" id="edit-title-${post.id}" class="form-control" value="${post.title}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-author-${post.id}">Author</label>
                            <input type="text" id="edit-author-${post.id}" class="form-control" value="${post.author}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-content-${post.id}">Content</label>
                            <textarea id="edit-content-${post.id}" class="form-control" required>${post.content}</textarea>
                        </div>
                        <div class="post-actions">
                            <button class="btn btn-save" data-id="${post.id}"><i class="far fa-save"></i> Save Changes</button>
                            <button class="btn btn-cancel" data-id="${post.id}"><i class="far fa-times-circle"></i> Cancel</button>
                        </div>
                    </div>
                `;
                postsContainer.appendChild(postElement);
            });
            
            // Add event listeners to delete buttons
            postsContainer.querySelectorAll('.btn-delete').forEach(button => {
                button.addEventListener('click', function() {
                    const postId = this.getAttribute('data-id');
                    openDeleteModal(postId);
                });
            });
            
            // Add event listeners to edit buttons
            postsContainer.querySelectorAll('.btn-edit').forEach(button => {
                button.addEventListener('click', function() {
                    const postId = this.getAttribute('data-id');
                    openEditForm(postId);
                });
            });
            
            // Add event listeners to save buttons
            postsContainer.querySelectorAll('.btn-save').forEach(button => {
                button.addEventListener('click', function() {
                    const postId = this.getAttribute('data-id');
                    saveEditedPost(postId);
                });
            });
            
            // Add event listeners to cancel buttons
            postsContainer.querySelectorAll('.btn-cancel').forEach(button => {
                button.addEventListener('click', function() {
                    const postId = this.getAttribute('data-id');
                    closeEditForm(postId);
                });
            });
        }

        // Open edit form
        function openEditForm(postId) {
            // Close any other open edit forms
            document.querySelectorAll('.edit-form').forEach(form => {
                form.style.display = 'none';
            });
            
            // Show the selected edit form
            const editForm = document.getElementById(`edit-form-${postId}`);
            editForm.style.display = 'block';
            
            // Scroll to the form
            editForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            isEditing = true;
        }

        // Close edit form
        function closeEditForm(postId) {
            const editForm = document.getElementById(`edit-form-${postId}`);
            editForm.style.display = 'none';
            isEditing = false;
        }

        // Save edited post
        function saveEditedPost(postId) {
            const title = document.getElementById(`edit-title-${postId}`).value;
            const author = document.getElementById(`edit-author-${postId}`).value;
            const content = document.getElementById(`edit-content-${postId}`).value;
            
            if (!title || !author || !content) {
                showNotification('Please fill in all fields', true);
                return;
            }
            

            // Update the post in the array
            posts = posts.map(post => {
                if (post.id === parseInt(postId)) {
                    return {
                        ...post,
                        title,
                        author,
                        content,
                        date: new Date().toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })
                    };
                }
                return post;
            });
            
            // Save to localStorage
            localStorage.setItem('blogPosts', JSON.stringify(posts));
            
            // Reload posts
            loadPosts();
            
            showNotification('Post updated successfully!');
            isEditing = false;
        }

        // Open delete confirmation modal
        function openDeleteModal(postId) {
            currentPostId = Number(postId);
            deleteModal.style.display = 'flex';
        }

        // Close delete confirmation modal
        function closeDeleteModal() {
            console.log("here")
            deleteModal.style.display = 'none';
            currentPostId = null;
        }

        // Delete post from localStorage
       function deletePost(postId) {
            posts = posts.filter(post => post.id !== parseInt(postId));
            localStorage.setItem('blogPosts', JSON.stringify(posts));
            showNotification('Post deleted successfully!');
            loadPosts();
       }


        // Save post to localStorage
        function savePost(title, author, content) {
            const newPost = {
                id: Date.now(), // Unique ID based on timestamp
                title,
                author,
                content,
                date: new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })
            };
            
            posts.push(newPost);
            localStorage.setItem('blogPosts', JSON.stringify(posts));
            showNotification('Post published successfully!');
            loadPosts();
        }

        // Clear all posts
        function clearAllPosts() {
            if (confirm('Are you sure you want to delete all posts? This cannot be undone.')) {
                localStorage.removeItem('blogPosts');
                showNotification('All posts have been deleted.');
                loadPosts();
            }
        }

        // Event listeners
        postForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (isEditing) {
                showNotification('Please finish editing before creating a new post', true);
                return;
            }
            
            const title = document.getElementById('title').value;
            const author = document.getElementById('author').value;
            const content = document.getElementById('content').value;
            
            savePost(title, author, content);
            
            // Reset form
            postForm.reset();
        });

        cancelDelete.addEventListener('click', closeDeleteModal);
        
        confirmDelete.addEventListener('click', function() {
            if (currentPostId != null) {
        deletePost(currentPostId);
        closeDeleteModal(); // <-- force close modal after deletion
            }
        });


        clearPostsBtn.addEventListener('click', clearAllPosts);

        // Close modal if clicked outside
        window.addEventListener('click', function(e) {
            if (e.target === deleteModal) {
                closeDeleteModal();
            }
        });

        // Initial load of posts
        document.addEventListener('DOMContentLoaded', loadPosts);
