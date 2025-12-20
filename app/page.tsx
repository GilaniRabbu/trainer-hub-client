import ContainerWrapper from "@/components/common/ContainerWrapper";
import Categories from "@/components/home/Categories";
// import FAQs from "@/components/home/FAQs";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import { JoinProviderSection } from "@/components/home/join-provider-section";
// import ServiceProviders from "@/components/home/ServiceProviders";
// import Statistics from "@/components/home/Statistics";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      {/* <ServiceProviders /> */}
      <ContainerWrapper>
        <JoinProviderSection />
        <HowItWorks />
        {/* <Statistics /> */}
        <Testimonials />
        {/* <FAQs /> */}
      </ContainerWrapper>
    </>
  );
}
