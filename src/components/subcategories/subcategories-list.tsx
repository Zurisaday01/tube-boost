import { Subcategory } from '@/types';
import SubcategoryCard from './subcategory-card';

const SubcategoriesList = ({
  subcategories
}: {
  subcategories: Subcategory[];
}) => {
  return (
    <div className='mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {subcategories.map((subcategory) => (
        <SubcategoryCard
          key={subcategory.id}
          id={subcategory.id}
          name={subcategory.name}
          color={subcategory.color}
          details={{
            modified: subcategory.updatedAt,
            created: subcategory.createdAt,
            location: subcategory?.playlist?.title || 'Unknown'
          }}
          playlistId={subcategory.playlistId}
        />
      ))}
    </div>
  );
};
export default SubcategoriesList;
