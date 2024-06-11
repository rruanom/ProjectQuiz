const getData = async () => {
    try {
        const resp = await fetch(url);
        if (resp.ok) {
            const data = await resp.json();
            results = data.results;
            printQuiz(results, index);
            console.log(results);
        } else {
            throw new Error('Error al obtener los datos');
        }
    } catch (error) {
        console.error(error);
    }
}
