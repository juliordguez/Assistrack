export const tableMixin = {
    data() {
      return {
        currentPage: 1,
        rowsPerPage: 10,
        searchQuery: '',
        rowsOptions: [5, 10, 20, 50],
      };
    },
    computed: {
      filteredData() {
        // Aquí puedes filtrar tus datos según el `searchQuery`
        return this.data.filter(item => 
          Object.values(item).some(value => 
            value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
          )
        );
      },
      paginatedData() {
        const start = (this.currentPage - 1) * this.rowsPerPage;
        const end = start + this.rowsPerPage;
        return this.filteredData.slice(start, end);
      },
      totalPages() {
        return Math.ceil(this.filteredData.length / this.rowsPerPage);
      }
    },
    methods: {
      onRowsPerPageChange() {
        this.currentPage = 1; // Resetea la página actual si cambias el número de filas por página
      },
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      },
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        }
      }
    }
  };
  