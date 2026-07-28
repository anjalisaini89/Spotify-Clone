function CategoryBar({
  categories,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <>
      <h2>🎼 Browse Categories</h2>

      <div className="category-row">

        {categories.map((cat) => (

          <button
            key={cat}
            className={`category-btn ${
              selectedCategory === cat
                ? "active"
                : ""
            }`}
            onClick={() =>
              setSelectedCategory(cat)
            }
          >
            {cat}
          </button>

        ))}

      </div>
    </>
  );
}

export default CategoryBar;