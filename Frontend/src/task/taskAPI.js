
export function createTask(task) {
  return new Promise(async (resolve) => {
    const response = await fetch('http://localhost:8000/task/', {
      method: 'POST',
      body: JSON.stringify(task),
      headers: { 'content-type': 'application/json' }
    });
    const data = await response.json();
    // console.log(data);
    resolve({ data });
  });
}

export function updateTask(update) {
  return new Promise(async (resolve) => {
    const response = await fetch('http://localhost:8000/task/' + update.id, {
      method: 'PUT',
      body: JSON.stringify(update),
      headers: { 'content-type': 'application/json' }
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function deleteTask(id) {
  return new Promise(async (resolve) => {
    await fetch('http://localhost:8000/task/' + id, {
      method: 'DELETE'
    });
    resolve({ id });
  });
}

export function fetchTaskById(id) {
  return new Promise(async (resolve) => {
    const response = await fetch('/tasks/' + id);
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchTasksByFilters(filter = {}, sortBy = "", order = "asc", page = 1, limit = 5) {
  let queryString = `?_page=${page}&_limit=${limit}&`;

  for (let key in filter) {
    if (filter[key]) queryString += `${key}=${filter[key]}&`;
  }

  if (sortBy) {
    queryString += `_sort=${sortBy}&_order=${order}`;
  }

  return new Promise(async (resolve) => {
    // const response = await fetch('http://localhost:8000/task' );
    const response = await fetch('http://localhost:8000/task' + queryString);
    const data = await response.json();
    const totalItems =  data.length;
    console.log(data);
    // const totalItems = response.headers.get('X-Total-Count') || data.length;
    // resolve({ data: { tasks: data, totalItems: +totalItems } });
    // resolve({ data: { tasks: data, totalItems: +totalItems } });
    resolve({ data });
  });
}
