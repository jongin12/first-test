function header(text) {
  let data = text;
  return `
  <header>
    <ul>
      <li>${data}</li>
    </ul>
  </header>
  `;
}