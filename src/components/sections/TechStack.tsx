import Image from "next/image";

const technologies = [
  { name: "React", logo: "/logos/react.svg" },
  { name: "Next.js", logo: "/logos/nextjs.svg" },
  { name: "Node.js", logo: "/logos/node-js-svgrepo-com.svg" },
  { name: "JavaScript", logo: "/logos/javascript.svg" },
  { name: "MongoDB", logo: "/logos/mongodb.svg" },
  { name: "MySQL", logo: "/logos/mysql-logo-svgrepo-com.svg" },
  { name: "PHP", logo: "/logos/php.svg" },
  { name: "Laravel", logo: "/logos/laravel-svgrepo-com.svg" },
];

function TechnologyList({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      aria-hidden={duplicate || undefined}
      className="flex shrink-0 items-center gap-8 px-4 sm:gap-16 sm:px-8"
    >
      {technologies.map((technology) => (
        <li
          key={technology.name}
          className="group flex shrink-0 items-center gap-3 text-sm font-medium text-gray-300 transition-colors hover:text-teal-300 sm:text-base"
        >
          <Image
            src={technology.logo}
            alt=""
            width={40}
            height={40}
            className="h-[35px] w-[35px] shrink-0 object-contain opacity-90 transition-opacity group-hover:opacity-100 sm:h-10 sm:w-10"
          />
          {technology.name}
        </li>
      ))}
    </ul>
  );
}

export default function TechStack() {
  return (
    <section className="relative overflow-hidden py-16">
      <div className="container relative z-10 mx-auto px-4">
        <h2 className="mb-8 bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-center text-3xl font-bold text-transparent sm:mb-12 md:text-4xl">
          Technologies I Work With
        </h2>

        <p className="mx-auto mb-12 max-w-2xl text-center text-gray-300">
          I specialize in modern web technologies that enable creating fast,
          responsive, and user-friendly applications.
        </p>

        <div className="container relative mx-auto overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          <div className="flex w-max animate-marquee motion-reduce:animate-none">
            <TechnologyList />
            <TechnologyList duplicate />
          </div>
        </div>
      </div>
    </section>
  );
}
