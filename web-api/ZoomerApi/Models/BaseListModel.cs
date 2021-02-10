namespace ZoomerApi.Models
{
    public class BaseListModel
    {
        public int PageCount { get; set; }

        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public int TotalRecords { get; set; }
    }
}
