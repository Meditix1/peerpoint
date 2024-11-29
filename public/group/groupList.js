const token = sessionStorage.getItem("authToken");

$(document).ready(function () {
    $('#table').DataTable({
        ajax: {
            url: '/groups/getUserViewableGroups?token=' + token,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            method: "GET",
            dataSrc: ""
        },
        columns: [
            { data: 'group_name', title: "Group Name" },
            { data: 'created_by', title: "Created By" },
            {
                data: 'created_at',
                title: "Created At",
                type: 'date',
                render: function (data, type, row) {
                    const date = new Date(data);

                    const options = { day: '2-digit', month: 'short', year: 'numeric' };
                    var formattedDate = date.toLocaleDateString('en-GB', options); // 'en-GB' gives the day first format
                    formattedDate = formattedDate.replace(',', '').replace(/\s+/g, '-'); // Replace comma and spaces with '-'

                    return formattedDate;
                }
            }
        ],
        createdRow: function (row, data, dataIndex) {
            // Assuming 'data' contains the group ID in a property called 'id'
            $(row).attr('data-grpId', data.id);
        }
    });

    $("#table tbody").on('click', function (e) {
        if (e.target.tagName == "TD" && e.target.parentNode.dataset.grpid) {
            window.location.href = "./viewGroup.html?id=" + e.target.parentNode.dataset.grpid;
        }
    })
});