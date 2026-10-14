import React from 'react'
import Hero from '../components/home/Hero'
import ExhibitionFilter from '../components/home/ExhibitionFilter'
import FeaturedExhibitions from '../components/home/FeaturedExhibitions'
import CollectionHighlight from '../components/home/CollectionHighlight'
import CollectionCards from '../components/home/CollectionCards'
import PlanVisit from '../components/home/PlanVisit'

export default function Home() {
  return (
    <>
      <Hero />
      <ExhibitionFilter />
      <div className="divider max-w-[1400px] mx-auto px-6" />
      <FeaturedExhibitions />
      <div className="divider max-w-[1400px] mx-auto px-6" />
      <CollectionHighlight />
      <div className="divider max-w-[1400px] mx-auto px-6" />
      <CollectionCards />
      <div className="divider max-w-[1400px] mx-auto px-6" />
      <PlanVisit />
    </>
  )
}
