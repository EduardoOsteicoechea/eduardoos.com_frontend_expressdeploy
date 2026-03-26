<script lang="ts">
  import { onMount } from "svelte";
  // Import the public environment variable
  import { PUBLIC_API_URL } from "$env/static/public";

  interface User {
    id: string;
    name: string;
  }

  let users: User[] = [];
  let loading: boolean = true;
  let errorMessage: string | null = null;

  // New variable to hold the form input
  let newUserName: string = "";
  let isSubmitting: boolean = false;
  const baseUrl = PUBLIC_API_URL || "http://localhost:3000";

  // Fetch users when the page loads
  async function fetchUsers() {
    try {
      const response = await fetch(`${baseUrl}/api/users`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      users = await response.json();
    } catch (error) {
      console.error("Could not fetch users:", error);
      errorMessage = "Failed to load users.";
    } finally {
      loading = false;
    }
  }

  // Submit a new user
  async function addUser(event: Event) {
    event.preventDefault(); // Prevent the page from refreshing
    if (!newUserName.trim()) return;

    isSubmitting = true;

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newUserName }),
      });

      if (!response.ok) throw new Error("Failed to add user");

      const savedUser = await response.json();

      // Add the new user to our list instantly
      users = [...users, savedUser];
      newUserName = ""; // Clear the input field
    } catch (error) {
      console.error(error);
      alert("Error adding user!");
    } finally {
      isSubmitting = false;
    }
  }

  onMount(fetchUsers);
</script>

<main>
  <h1>User List</h1>

  <form on:submit={addUser} class="add-user-form">
    <input
      type="text"
      bind:value={newUserName}
      placeholder="Enter a new user's name..."
      disabled={isSubmitting}
    />
    <button type="submit" disabled={isSubmitting || !newUserName.trim()}>
      {isSubmitting ? "Adding..." : "Add User"}
    </button>
  </form>

  {#if loading}
    <p>Loading users...</p>
  {:else if errorMessage}
    <p style="color: red;">{errorMessage}</p>
  {:else}
    <ul>
      {#each users as user (user.id)}
        <li><strong>{user.name}</strong> <small>(ID: {user.id})</small></li>
      {:else}
        <p>No users found. Try adding one above!</p>
      {/each}
    </ul>
  {/if}
</main>

<style>
  /* ... Keep your existing main, ul, li styles ... */
  main {
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 2rem auto;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 8px;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    background: white;
    margin: 0.5rem 0;
    padding: 1rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  /* New Form Styles */
  .add-user-form {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  button {
    padding: 10px 15px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:disabled {
    background: #aaa;
    cursor: not-allowed;
  }
</style>
