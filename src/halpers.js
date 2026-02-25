export const getJSON = async function (url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("PROBLEM");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};
