delete from t_content where url in (
  select url 
	from t_content 
	group by url
	having count(*) > 1
) and rowid not in (
  select max(rowid) 
	from t_content  
	group by url
	having count(*) > 1
)