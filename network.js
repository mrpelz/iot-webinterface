const eventSource = new EventSource('/stream');
eventSource.addEventListener('message', ({ data }) => { console.log(data); });
